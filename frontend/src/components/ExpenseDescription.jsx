import { Text } from "@mantine/core";
import React from "react";
import { urlMatcher } from "../constants/app";

const ExpenseDescription = ({ children = "", ...rest }) => {
  return (
    <Text {...rest} component="p" fz="sm" sx={{ whiteSpace: "pre" }} m={0}>
      {children.split(" ").map((part, i) =>
        urlMatcher.test(part) ? (
          <Text
            c="white"
            key={part + i}
            component="a"
            href={part}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(part).host}{" "}
          </Text>
        ) : (
          <Text color="dimmed" component="span" key={part + i}>
            {part}{" "}
          </Text>
        )
      )}
    </Text>
  );
};

export default ExpenseDescription;
