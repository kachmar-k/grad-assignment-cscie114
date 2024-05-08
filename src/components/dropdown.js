import * as React from "react";

const Dropdown = (props) => {
  const options = props.options;

  return (
    <div>
      <select
        style={{ width: "100%" }}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {options.map((o) => {
          return (
            <option
              value={o.value ?? o}
              key={o.key ?? o}
              label={o.label ?? undefined}
            >
              {o.value ?? o}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
