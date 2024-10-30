import { describe, it, expect } from "vitest";

describe("App", () => {
  it("Renders 'hello' into the document", () => {
    document.body.innerHTML = "<h1>hello</h1>";
    expect(document.body).toHaveTextContent("hello");
  });
});