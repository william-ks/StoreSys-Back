import { UserMemoryRepository } from "./../../../../../../tests/memoryRepository/userMemoryRepository";
import { describe, expect, test } from "vitest";
import { CreateStoreService } from "./createStore.service";

describe("create user Tests", () => {
  const userMemoryRepository = new UserMemoryRepository();
  const service = new CreateStoreService(userMemoryRepository);

  const storeTest = {
    name: "John",
    email: "john@gmail.com",
    password: "test123",
  };

  test("is adding user ?", async () => {
    await service.execute(storeTest);

    expect(userMemoryRepository.users[0]).toHaveProperty(
      "name",
      storeTest.name,
    );
  });

  test("try insert a repeted User", async () => {
    try {
      await service.execute(storeTest);
    } catch (e) {
      expect(e.code).toBe(400);
    }
  });
});
