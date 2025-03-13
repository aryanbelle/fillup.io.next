import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCheck, FiCopy } from "react-icons/fi";

const CustomSnippet = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative bg-gray-800 p-2.5  md:p-2 rounded-lg shadow-md flex  justify-between items-center max-w-full">
      <pre className="font-mono  text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-grow  text-white overflow-hidden whitespace-nowrap overflow-ellipsis">
        {url}
      </pre>
      <CopyToClipboard text={url} onCopy={handleCopy}>
        <button
          className={`absolute  top-1/2 right-2 transform -translate-y-1/2 text-white text-lg rounded transition duration-300 ease-in-out ${
            copied ? "bg-green-500 text-gray-700" : "bg-blue-500"
          } p-2`}
          title="Copy URL"
          aria-label={copied ? "Copied" : "Copy URL"}
        >
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </CopyToClipboard>
      {copied && (
        <div
          className="absolute bottom-0 right-0 mb-2 mr-2 text-xs text-green-500 animate-bounce transition-opacity duration-300"
          aria-live="assertive"
        >
          Copied!
        </div>
      )}
    </div>
  );
};

export default CustomSnippet;
