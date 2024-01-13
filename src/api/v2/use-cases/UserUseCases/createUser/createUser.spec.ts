import { UserMemoryRepository } from "./../../../../../../tests/memoryRepository/userMemoryRepository";
import { describe, expect, test } from "vitest";
import { CreateUserService } from "./createUser.service";

describe("create user Tests", () => {
  const userMemoryRepository = new UserMemoryRepository();
  const service = new CreateUserService(userMemoryRepository);

  const userTest = {
    name: "John",
    email: "john@gmail.com",
    password: "test123",
  };

  test("is adding user ?", async () => {
    await service.execute(userTest);

    expect(userMemoryRepository.users[0]).toHaveProperty("name", userTest.name);
  });

  test("try insert a repeted User", async () => {
    try {
      await service.execute(userTest);
    } catch (e) {
      expect(e.code).toBe(400);
    }
  });
});
