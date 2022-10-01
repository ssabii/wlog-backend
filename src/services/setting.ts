import CustomError from "lib/errors/CustomError";
import StatusCode from "lib/errors/enums/StatusCode";
import Setting from "models/Setting";

class SettingService {
  public async getSetting(username: string) {
    return await Setting.findOne({
      where: { username },
    })
      .then((setting) => {
        if (setting) {
          return setting;
        } else {
          throw new CustomError(StatusCode.NOT_FOUND, "setting not found");
        }
      })
      .catch(() => {
        throw new CustomError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "get setting failed"
        );
      });
  }

  public async createSetting(setting: Setting) {
    const {
      username,
      workStartTime,
      workEndTime,
      lunchStartTime,
      lunchEndTime,
      workingDay,
      autoRecord,
      isTwelveHour,
    } = setting;
    const settingRecord = await Setting.findOne({ where: { username } });

    if (settingRecord) {
      throw new CustomError(StatusCode.CONFLICT, "setting already exists");
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    return await Setting.create({
      username,
      workStartTime: workStartTime ?? new Date(year, month, date, 9),
      workEndTime: workEndTime ?? new Date(year, month, date, 18),
      lunchStartTime: lunchStartTime ?? new Date(year, month, date, 12),
      lunchEndTime: lunchEndTime ?? new Date(year, month, date, 13),
      workingDay: workingDay ?? 1 + 2 + 3 + 4 + 5, // 월, 화, 수, 목, 금
      autoRecord: autoRecord ?? false,
      isTwelveHour: isTwelveHour ?? true,
    }).catch(() => {
      throw new CustomError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "create setting failed"
      );
    });
  }

  public async updateSetting(setting: Setting) {
    const {
      username,
      workStartTime,
      workEndTime,
      lunchStartTime,
      lunchEndTime,
      workingDay,
      autoRecord,
      isTwelveHour,
    } = setting;
    const settingRecord = await Setting.findOne({ where: { username } });

    if (settingRecord) {
      return await settingRecord
        .update({
          username,
          workStartTime: workStartTime ?? settingRecord.workStartTime,
          workEndTime: workEndTime ?? settingRecord.workEndTime,
          lunchStartTime: lunchStartTime ?? settingRecord.lunchStartTime,
          lunchEndTime: lunchEndTime ?? settingRecord.lunchEndTime,
          workingDay: workingDay ?? settingRecord.workingDay,
          autoRecord: autoRecord ?? settingRecord.autoRecord,
          isTwelveHour: isTwelveHour ?? settingRecord.isTwelveHour,
        })
        .catch(() => {
          throw new CustomError(
            StatusCode.INTERNAL_SERVER_ERROR,
            "update setting failed"
          );
        });
    } else {
      throw new CustomError(StatusCode.NOT_FOUND, "setting not found");
    }
  }

  public async deleteSetting(username: string) {
    const settingRecord = await Setting.findOne({ where: { username } });

    if (settingRecord) {
      return await settingRecord.destroy();
    } else {
      throw new CustomError(StatusCode.NOT_FOUND, "setting not found");
    }
  }
}

const settingService = new SettingService();

export default settingService;
