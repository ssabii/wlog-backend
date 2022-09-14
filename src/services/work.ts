import Work, { WorkAttributes, WorkType } from "models/Work";

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

    return await Work.create(
      {
        username,
        type,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        memo: memo ?? undefined,
      },
      { fields: this.selectors }
    ).catch(() => {
      throw new Error("create failed");
    });
  }

  public async updateWork(work: Work): Promise<Work> {
    const { id, username, startDate, endDate, memo } = work;
    const workRecord = await Work.findOne({ where: { id } });

    if (workRecord) {
      if (workRecord.username !== username) {
        throw new Error("not authorized");
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
          throw new Error("update failed");
        });
    } else {
      throw new Error("not found");
    }
  }

  public async deleteWork(work: Partial<Work>) {
    const { id, username } = work;
    const workRecord = await Work.findOne({ where: { id } });

    if (workRecord) {
      if (workRecord.username !== username) {
        throw new Error("not authorized");
      }

      return await workRecord.destroy();
    } else {
      throw new Error("not found");
    }
  }
}

const workService = new WorkService();

export default workService;
