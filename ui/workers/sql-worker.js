importScripts("/lib/sql.js");

let db = null;

async function initSql() {
  try {
    const SQL = await initSqlJs({
      locateFile: (file) => `/sql-wasm.wasm`,
    });
    db = new SQL.Database();
    db.run("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, json TEXT)");
    self.postMessage({ type: "initialized" });
  } catch (error) {
    self.postMessage({ type: "error", error: error.message });
  }
}

self.onmessage = async function (e) {
  const { type, data } = e.data;

  switch (type) {
    case "init":
      await initSql();
      break;

    case "query":
      try {
        const result = db.exec(data.query);
        self.postMessage({ type: "queryResult", result });
      } catch (error) {
        self.postMessage({ type: "error", error: error.message });
      }
      break;

    case "createTestData":
      try {
        const startTime = performance.now();
        db.run("BEGIN TRANSACTION");

        for (let i = 0; i < 60; i++) {
          const randomName = data.names[Math.floor(Math.random() * data.names.length)];
          db.run("INSERT INTO test (name, json) VALUES (?, ?)", [randomName + "_" + i, data.testJson]);
        }

        db.run("COMMIT");
        const endTime = performance.now();

        self.postMessage({
          type: "createTestDataResult",
          executionTime: ((endTime - startTime) / 1000).toFixed(2),
        });
      } catch (error) {
        db.run("ROLLBACK");
        self.postMessage({ type: "error", error: error.message });
      }
      break;

    case "deleteTestData":
      try {
        db.run("DELETE FROM test");
        self.postMessage({ type: "deleteTestDataResult" });
      } catch (error) {
        self.postMessage({ type: "error", error: error.message });
      }
      break;
  }
};
