import { Text } from "@mantine/core";
import React from "react";
import { urlMatcher } from "../../constants/app.constants";

const ExpenseDescription = ({ children = "", ...rest }) => {
  return (
    <Text {...rest} component="p" m={0}>
      {children.split(" ").map((part, i) =>
        urlMatcher.test(part) ? (
          <Text
            key={part + i}
            component="a"
            variant="link"
            href={part}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(part).host}{" "}
          </Text>
        ) : (
          <React.Fragment key={part + i}>{part} </React.Fragment>
        )
      )}
    </Text>
  );
};

export default ExpenseDescription;
