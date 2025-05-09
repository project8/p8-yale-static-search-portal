import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../test-utils";

import result from "../fixtures/GMetaResult.json";

import Result from "../../src/components/Result";

import _STATIC from "../../static.json" with { type: "json" };

describe("Result", () => {
  it("renders the result component correctly", async () => {
    // @ts-expect-error
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.name);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.name,
    );
  });

  it("supports 'components.Result.heading'", async () => {
    /**
     * Change the value of `components.Result.heading`
     */
    _STATIC.data.attributes.components.Result.heading =
      "entries[0].content.raw_metadata";
    // @ts-expect-error
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.raw_metadata);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.raw_metadata,
    );
  });
});
