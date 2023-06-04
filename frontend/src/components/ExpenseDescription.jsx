import { Text } from "@mantine/core";
import React from "react";
import { urlMatcher } from "../constants/app";

const ExpenseDescription = ({ children = "", ...rest }) => {
  return (
    <Text {...rest} component="p" fz="xs" sx={{ whiteSpace: "pre-wrap" }} m={0}>
      {children.split(" ").map((part, i) =>
        urlMatcher.test(part) ? (
          <Text
            key={part + i}
            component="a"
            href={part}
            target="_blank"
            rel="noreferrer"
            fw={500}
            c="white"
          >
            {new URL(part).host}{" "}
          </Text>
        ) : (
          <Text component="span" key={part + i}>
            {part}{" "}
          </Text>
        )
      )}
    </Text>
  );
};

export default ExpenseDescription;
