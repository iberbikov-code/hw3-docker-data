# generator/generate.py
import csv
import random
import os
import sys

NUM_ROWS = 100
COLUMNS = ["BRAND", "year", "price", "color"]

def generate_row():
    return {
        "BRAND": random.choice(["Toyota", "BMW", "Ford", "Lada", "Tesla"]),
        "year": random.randint(2010, 2024),
        "price": round(random.uniform(5000.0, 50000.0), 2),
        "color": random.choice(["Red", "Black", "White", "Silver", "Blue"]),
    }

OUTPUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "/data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "data.csv")
os.makedirs(OUTPUT_DIR, exist_ok=True)

rows = [generate_row() for _ in range(NUM_ROWS)]

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=COLUMNS)
    writer.writeheader()
    writer.writerows(rows)
    
print(f"Успешно сгенерировано {NUM_ROWS} строк в {OUTPUT_FILE}")