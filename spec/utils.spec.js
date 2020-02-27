const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
  doesValueExistInTable
} = require("../db/utils/utils");

describe("doesValueExistInTable", () => {});

describe("formatDates", () => {
  const date1 = new Date();
  const millisecs1 = date1.getTime();
  const date2 = new Date();
  const millisecs2 = date2.getTime();

  it("Takes an array of objects and returns a new array. Each item in the new array has its timestamp at created_by converted into a Javascript date object. Everything else in each item is maintained.", () => {
    const input = [
      { name: "Adam", created_at: millisecs1 },
      { name: "Lilith", created_at: millisecs2 }
    ];
    const expected = [
      { name: "Adam", created_at: date1 },
      { name: "Lilith", created_at: date2 }
    ];
    const actual = formatDates(input);
    expect(actual).to.eql(expected);
  });
  it("Returns a new array of new objects, does not mutate original array or original objects.", () => {
    const input = [
      { name: "Adam", created_at: millisecs1 },
      { name: "Lilith", created_at: millisecs2 }
    ];
    const copyInput = [
      { name: "Adam", created_at: millisecs1 },
      { name: "Lilith", created_at: millisecs2 }
    ];
    //const expected = [{name: "Adam", created_at: date1}, {name: "Lilith", created_at: date2}]
    const actual = formatDates(input);
    expect(actual).to.not.equal(input);
    expect(input).to.eql(copyInput);
    expect(actual[0]).to.not.equal(input[0]);
    expect(input[0]).to.eql(copyInput[0]);
  });
});

/*This utility function should be able to take an array (`list`) 
of objects and return a new array. Each item in the new array must 
have its timestamp converted into a Javascript date object. 
Everything else in each item must be maintained. */

describe("makeRefObj", () => {
  it("Returns empty object when given empty array.", () => {
    const input = [];
    const expected = {};
    const actual = makeRefObj(input, "name", "age");
    expect(actual).to.eql(expected);
  });
  it("Returns reference object with single key-value pair for arr of two value.", () => {
    const input = [{ title: "God and Stuff", author: "Rupert Sheldrake" }];
    const expected = { "God and Stuff": "Rupert Sheldrake" };
    const actual = makeRefObj(input, "title", "author");
    expect(actual).to.eql(expected);
  });
  it("Returns reference object of many key-values pair for arr of many values.", () => {
    const input = [
      { name: "Brian", age: 14 },
      { name: "Brienne", age: 27 },
      { name: "King Brine", age: 512 }
    ];
    const expected = { Brian: 14, Brienne: 27, "King Brine": 512 };
    const actual = makeRefObj(input, "name", "age");
    expect(actual).to.eql(expected);
  });
  it("Does not mutate original array or original objects.", () => {
    const input = [
      { name: "Brian", age: 14 },
      { name: "Brienne", age: 27 },
      { name: "King Brine", age: 512 }
    ];
    const copyInput = [
      { name: "Brian", age: 14 },
      { name: "Brienne", age: 27 },
      { name: "King Brine", age: 512 }
    ];
    makeRefObj(input, "name", "age");
    expect(input).to.eql(copyInput);
    expect(input[0]).to.eql(copyInput[0]);
  });
});

describe("formatComments", () => {
  it("Returns empty array when given empty array", () => {
    const actual = formatComments([], { Canberra: "Australia" });
    const expected = [];
    expect(actual).to.eql(expected);
  });

  it("Returns objects with properties changed.", () => {
    const articleRef = { One: 1, Seventeen: 17, Fifty: 50, "Eighty-four": 84 };

    const date1 = new Date();
    const millisecs1 = date1.getTime();
    const date2 = new Date();
    const millisecs2 = date2.getTime();

    const input = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "Seventeen",
        created_by: "icellusedkars",
        votes: 20,
        created_at: millisecs1
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Eighty-four",
        created_by: "butter_bridge",
        votes: 16,
        created_at: millisecs2
      }
    ];

    const expected = [
      {
        body: "The owls are not what they seem.",
        article_id: 17,
        author: "icellusedkars",
        votes: 20,
        created_at: date1
      },
      {
        body: "This morning, I showered for nine minutes.",
        article_id: 84,
        author: "butter_bridge",
        votes: 16,
        created_at: date2
      }
    ];

    const actual = formatComments(input, articleRef);

    expect(actual).to.eql(expected);
  });

  it("Returns a new array, does not mutate original objects or original array.", () => {
    const articleRef = { One: 1, Seventeen: 17, Fifty: 50, "Eighty-four": 84 };

    const date1 = new Date();
    const millisecs1 = date1.getTime();
    const date2 = new Date();
    const millisecs2 = date2.getTime();

    const input = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "Seventeen",
        created_by: "icellusedkars",
        votes: 20,
        created_at: millisecs1
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Eighty-four",
        created_by: "butter_bridge",
        votes: 16,
        created_at: millisecs2
      }
    ];

    const copyInput = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "Seventeen",
        created_by: "icellusedkars",
        votes: 20,
        created_at: millisecs1
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Eighty-four",
        created_by: "butter_bridge",
        votes: 16,
        created_at: millisecs2
      }
    ];

    const actual = formatComments(input, articleRef);

    expect(actual).to.not.equal(input);
    expect(actual[0]).to.not.equal(input[0]);
    expect(input).to.eql(copyInput);
    expect(input[0]).to.eql(copyInput[0]);
  });
});
