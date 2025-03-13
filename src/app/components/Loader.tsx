import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loader() {
  return (
    <Spinner
      className="w-full h-full  self-center"
      size="lg"
      label="Loading..."
      color="primary"
      labelColor="primary"
    />
  );
}
