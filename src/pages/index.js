import * as React from "react";
import { useState, useEffect } from "react";
import Dropdown from "../components/dropdown";
import { graphql, useStaticQuery } from "gatsby";

const IndexPage = () => {
  const [displayGroup, setGroup] = useState(null);
  const [displayRoute, setDisplayRoute] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [displayParameters, setParameters] = useState(null);
  const [displayParameters2, setParameters2] = useState(null);
  const [param, setParam] = useState(null);

  const [api, setApi] = useState("https://api.weather.gov");

  let apiUrl = "https://api.weather.gov";

  const routeData = useStaticQuery(graphql`
    query {
      allRouteOptions {
        nodes {
          route
          group
          description
          parameters {
            required
            name
            description
          }
        }
      }
      allRouteGroups {
        nodes {
          groupName
        }
      }
      allZoneOptions {
        nodes {
          zoneId
          type
          name
        }
      }
      allZoneTypes {
        nodes {
          type
        }
      }
    }
  `);

  // set up options
  const allZones = [""];
  routeData.allZoneOptions.nodes.forEach((zone) => {
    allZones.push({
      value: zone.zoneId,
      key: zone.zoneId,
      label: `${zone.zoneId} (${zone.name})`,
    });
  });

  const zoneTypes = [""];
  routeData.allZoneTypes.nodes.forEach((zoneType) => {
    zoneTypes.push(zoneType.type);
  });

  const regions = ["AL", "AT", "GL", "GM", "PA", "PI"];
  const areas = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const options = [""];
  routeData.allRouteGroups.nodes.forEach((node) => {
    if (
      node.groupName !== "/icons" &&
      node.groupName !== "/aviation" &&
      node.groupName !== "/products" &&
      node.groupName !== "/stations"
    )
      options.push(node.groupName);
  });

  let routeOptions = [];

  const selectedRouteChange = (selected) => {
    routeOptions.map((option) => {
      if (option.value === selected) {
        setSelectedDescription(`Description: ${option.description}`);
        getParameters(selected);
        setApi(api + selected);
        apiUrl += selected;
        console.log(apiUrl);
      }
    });
  };

  function getParameters(url) {
    setParameters(null);
    setParameters2(null);
    if (url.includes("{zoneId}")) {
      setParameters(
        <div>
          <span style={{ fontWeight: 800 }}>ZoneId:</span>
          <Dropdown options={allZones} onChange={getAPI}></Dropdown>
        </div>
      );
    }
    if (url.includes("{type}")) {
      setParameters2(
        <div>
          <span style={{ fontWeight: 800 }}>Type:</span>
          <Dropdown options={zoneTypes} onChange={getAPI}></Dropdown>
        </div>
      );
    }
    if (url.includes("{time}")) {
      setParameters2(
        <div>
          <span style={{ fontWeight: 800 }}>Date/Time:</span>
          <input type="datetime-local"></input>
        </div>
      );
    }
    if (url.includes("{area}")) {
      setParameters(
        <div>
          <span style={{ fontWeight: 800 }}>Area:</span>
          <Dropdown options={regions} onChange={getAPI}></Dropdown>
        </div>
      );
    }
    if (url.includes("{region}")) {
      setParameters(
        <div>
          <span style={{ fontWeight: 800 }}>Region:</span>
          <Dropdown options={regions} onChange={getAPI}></Dropdown>
        </div>
      );
    }
  }

  const getAPI = (newValue) => {
    console.log(`hi`);
    setParam(api + newValue);
    console.log(param);
  };

  const groupChange = (selected) => {
    setGroup(selected);
    routeOptions = [""];
    routeData.allRouteOptions.nodes.map((route, index) => {
      if (route.group == selected) {
        routeOptions.push({
          value: route.route,
          key: index,
          label: route.route,
          description: route.description,
        });
      }
    });
    setDisplayRoute(
      <Dropdown
        options={routeOptions}
        onChange={selectedRouteChange}
      ></Dropdown>
    );
  };

  return (
    <div style={{ fontFamily: "Avenir" }}>
      <h1>National Weather Service Api Builder</h1>
      <h3>Build an API for the National Weather Service API</h3>
      <p>
        The purpose of this project is to display all possible options for the
        NWS API calls.
      </p>
      <div style={{ width: "400px" }}>
        <div style={{ display: "block", paddingLeft: "100px" }}>
          <h3 style={{ marginBottom: 0 }}>Select a category</h3>
          <Dropdown options={options} onChange={groupChange}></Dropdown>
        </div>
        <br></br>
        <div style={{ display: "block", paddingLeft: "100px" }}>
          {displayRoute ? (
            <h3 style={{ marginBottom: 0 }}>Select an API</h3>
          ) : (
            ""
          )}
          {displayRoute}
          <p>{selectedDescription}</p>
        </div>
        <br />
        <div style={{ display: "block", paddingLeft: "100px" }}>
          {displayParameters ? (
            <h3 style={{ marginBottom: 0 }}>View Parameters</h3>
          ) : (
            ""
          )}
          {displayParameters}
          <br />
          {displayParameters2}
        </div>

        <br />
      </div>
    </div>
  );
};

export default IndexPage;

export const Head = () => <title>Api Builder</title>;
