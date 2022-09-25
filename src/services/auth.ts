import { redisClient } from "config/redis";
import { IncomingHttpHeaders } from "http";
import { decode, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import CustomError from "lib/errors/CustomError";
import StatusCode from "lib/errors/enums/StatusCode";
import {
  CustomJwtPayload,
  refresh,
  sign,
  verify,
  verifyRefresh,
} from "lib/jwt";
import { generatePassword, validatePassword } from "lib/password";
import User from "models/User";
import { promisify } from "util";

class AuthService {
  public async login(username: string, password: string) {
    return await User.findOne({ where: { username } })
      .then((user) => {
        if (user) {
          const { id, hash, salt } = user;
          const isValid = validatePassword(password, hash, salt);

          if (isValid) {
            const accessToken = sign(user);
            const refreshToken = refresh();

            redisClient.set(id, refreshToken);
            redisClient.expire(id, 60 * 60 * 24 * 7);

            return {
              accessToken,
              refreshToken,
            };
          } else {
            throw new CustomError(StatusCode.UNAUTHORIZED, "invalid password");
          }
        } else {
          throw new CustomError(StatusCode.NOT_FOUND, "could not found user");
        }
      })
      .catch(() => {
        throw new CustomError(StatusCode.NOT_FOUND, "login failed");
      });
  }

  public async register(
    username: string,
    password: string,
    displayName?: string
  ) {
    const userRecord = await User.findOne({
      where: { username },
    });

    if (userRecord) {
      throw new CustomError(StatusCode.CONFLICT, "username already exists");
    }

    const { salt, hash } = generatePassword(password);
    const newUser = User.build({
      username,
      salt,
      hash,
      displayName: displayName ?? username,
    });

    return await newUser
      .save()
      .then((user) => {
        return {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
        };
      })
      .catch(() => {
        throw new CustomError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "register failed"
        );
      });
  }

  public async logout(id: string) {
    const existsAsync = promisify(redisClient.exists).bind(redisClient);
    const refreshToken = await existsAsync(id);

    if (refreshToken) {
      await redisClient.del(id).catch(() => {
        throw new CustomError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "logout failed"
        );
      });
    } else {
      throw new CustomError(StatusCode.NOT_FOUND, "could not found user");
    }
  }

  public async refresh(headers: IncomingHttpHeaders) {
    const authorization = headers.authorization;
    const refresh = headers.refresh as string;
    const accessToken = authorization?.split(" ")[1];
    const refreshToken = refresh?.split(" ")[1];

    if (!accessToken || !refreshToken) {
      throw new CustomError(
        StatusCode.BAD_REQUEST,
        "access token and refresh token are need for refresh"
      );
    }

    try {
      <CustomJwtPayload>verify(accessToken);
      throw new CustomError(
        StatusCode.BAD_REQUEST,
        "access token is not expired"
      );
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        const decoded = <CustomJwtPayload>decode(accessToken);
        const user = await User.findOne({ where: { id: decoded.id } });

        if (user) {
          const refreshVerification = await verifyRefresh(
            refreshToken,
            decoded.id
          );
          if (refreshVerification) {
            const newAccessToken = sign(user);

            return {
              accessToken: newAccessToken,
              refreshToken: refresh,
            };
          } else {
            throw new CustomError(
              StatusCode.UNAUTHORIZED,
              "invalid refresh token"
            );
          }
        } else {
          throw new CustomError(StatusCode.NOT_FOUND, "could not found user");
        }
      } else if (e instanceof JsonWebTokenError) {
        throw new CustomError(StatusCode.UNAUTHORIZED, "invalid access token");
      } else {
        throw new CustomError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "refresh failed"
        );
      }
    }
  }
}

const authService = new AuthService();

export default authService;
