import fs from "node:fs";

const filePath = "./cdn/data.json";

const data = JSON.parse(
  fs.readFileSync(filePath, "utf8")
);

const today = new Date();

today.setHours(0, 0, 0, 0);

let changed = false;

data.trips = data.trips.map((trip) => {
  const tripDate = new Date(
    `${trip.date}T00:00:00`
  );

  if (tripDate < today && !trip.completed) {
    changed = true;

    return {
      ...trip,
      completed: true,
    };
  }

  return trip;
});

if (changed) {
  data.updatedAt = new Date().toISOString();

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2) + "\n"
  );

  console.log("Data updated");
} else {
  console.log("No changes needed");
}