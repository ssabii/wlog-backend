import CustomError from "lib/errors/CustomError";
import StatusCode from "lib/errors/enums/StatusCode";
import Work, { WorkAttributes } from "models/Work";

class WorkService {
  private selectors: (keyof WorkAttributes)[] = [
    "id",
    "type",
    "startDate",
    "endDate",
    "memo",
  ];

  public async getWork(username: string): Promise<Work[]> {
    const works = await Work.findAll({
      where: { username },
      attributes: this.selectors,
      order: [["startDate", "DESC"]],
    });

    return works;
  }

  public async createWork(work: Work): Promise<Work> {
    const { username, type, startDate, endDate, memo } = work;

    return await Work.create({
      username,
      type,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      memo: memo ?? undefined,
    }).catch(() => {
      throw new CustomError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "create work failed"
      );
    });
  }

  public async updateWork(work: Work): Promise<Work> {
    const { id, username, startDate, endDate, memo } = work;
    const workRecord = await Work.findOne({ where: { id } });

    if (workRecord) {
      if (workRecord.username !== username) {
        throw new CustomError(StatusCode.UNAUTHORIZED, "not authorized");
      }

      return await work
        .update(
          {
            startDate: startDate ?? workRecord.startDate,
            endDate: endDate ?? workRecord.endDate,
            memo: memo ?? workRecord.memo,
          },
          { fields: this.selectors }
        )
        .catch(() => {
          throw new CustomError(
            StatusCode.INTERNAL_SERVER_ERROR,
            "update work failed"
          );
        });
    } else {
      throw new CustomError(StatusCode.NOT_FOUND, "work not found");
    }
  }

  public async deleteWork(work: Partial<Work>) {
    const { id, username } = work;
    const workRecord = await Work.findOne({ where: { id } });

    if (workRecord) {
      if (workRecord.username !== username) {
        throw new CustomError(StatusCode.UNAUTHORIZED, "not authorized");
      }

      return await workRecord.destroy();
    } else {
      throw new CustomError(StatusCode.NOT_FOUND, "work not found");
    }
  }
}

const workService = new WorkService();

export default workService;
