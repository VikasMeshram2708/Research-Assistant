import { test, expect, describe, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Hero from "@/components/home/hero";

describe("testing hero component", () => {
  beforeEach(() => {
    render(<Hero />);
  });

  //   clean up
  afterEach(() => {
    cleanup();
  });

  test("render a heading element", () => {
    expect(screen.getByRole("heading")).toBeDefined();
  });

  test("render a button element", () => {
    expect(screen.getByTestId("get_started_btn")).toBeDefined();
  });
});
