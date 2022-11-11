import { referenceQuery, occurrenceQuery } from "./queries"

describe("occurrenceQuery", () => {
  let filters;
  
  beforeEach(() => {
    filters = {
      country: { value: null },
      species: { value: null },
      isLarval: { value: null },
      isAdult: { value: null },
      control: { value: null },
      season: { value: null },
      timeRange: { 
        value: {
          start: null,
          end: null,
        }
      }
    };
  })

  it("returns the correct query without any filters", () => {
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  })

  it("includes countries if in filters", () => {
    filters.country.value = ["Kenya", "Uganda"]
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  })

  it("converts time range if in filters", () => {
    filters.timeRange.value = {
      start: 1001,
      end: 2002
    }
    expect(occurrenceQuery(0, 100, filters)).toMatchSnapshot();
  })
})

describe("referenceQuery", () => {
  it("returns the correct query", () => {
    expect(referenceQuery()).toMatchSnapshot();
  })
})