import faker from "faker";

export interface DbList {
  toDo: string;
  creationDate: string;
  dueBy: string;
}

export interface DbListWithId extends DbList {
  id: number;
}

const db: DbListWithId[] = [];

/** Variable to keep incrementing id of database items */
let idCounter = 0;

let today = new Date().toLocaleDateString();
let randomDate = `${Math.floor(Math.random() * 13) + 1}/${
  Math.floor(Math.random() * 32) + 1
}/${Math.floor(Math.random() * 20) + 2022}`;

/**
 * Adds in some dummy database items to the database
 *
 * @param n - the number of items to generate
 * @returns the created items
 */
export const addDummyDbListIDs = (n: number): DbListWithId[] => {
  const createdSignatures: DbListWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdSignature = addDbList({
      toDo: faker.lorem.sentences(3), // random fake message
      creationDate: today,
      dueBy: randomDate,
    });
    createdSignatures.push(createdSignature);
  }
  return createdSignatures;
};

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addDbList = (data: DbList): DbListWithId => {
  const newEntry: DbListWithId = {
    id: ++idCounter,
    ...data,
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteDbListById = (id: number): DbListWithId | "not found" => {
  const idxToDeleteAt = findIndexOfDbListById(id);
  if (typeof idxToDeleteAt === "number") {
    const listToDelete = getDbListById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return listToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given id
 *
 * @param id - the id of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfDbListById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllDbListIDs = (): DbListWithId[] => {
  return db;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getDbListById = (id: number): DbListWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateDbListById = (
  id: number,
  newData: Partial<DbList>
): DbListWithId | "not found" => {
  const idxOfEntry = findIndexOfDbListById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
