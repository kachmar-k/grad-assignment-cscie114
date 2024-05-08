import type { GatsbyNode } from "gatsby"
const eleventyFetch = require("@11ty/eleventy-fetch");

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  // API Routes
  let response = await fetchData(`https://api.weather.gov/openapi.json`);
  const paths = response.paths;
  let routeOptions = Object.keys(paths);
  let groups: any[] = [];
  routeOptions.forEach((route: any) => {
    if (route.lastIndexOf('/') == 0) {
      groups.push(route);
      createNode({
        groupName: route,
        id: createNodeId(`${route}`),
        parent: null,
        children: [],
        internal: {
          type: "routeGroups",
          contentDigest: createContentDigest(route),
        },
      })
    }
  })
  routeOptions.forEach((route: any) => {
    const routeInfo = paths[route].get;
    let apiParameters: { name: string, description: string, required: string }[] = [];

    paths[route].parameters?.forEach((parameter: any) => {
      if (parameter.name) {
        apiParameters.push({
          name: parameter.name,
          description: parameter.description,
          required: parameter.required,
        });
      }
    });

    let nodeGroup;
    groups.forEach(group => {
      if (route.startsWith(group)) {
        nodeGroup = group;
      }
    })

    createNode({
      route,
      group: nodeGroup,
      description: routeInfo.description,
      parameters: apiParameters,
      id: createNodeId(`${routeInfo.operationId}`), //[ pass a unique identifier here: [movie.id] for example
      parent: null,
      children: [],
      internal: {
        type: "routeOptions", // name of collection in graphql schema
        contentDigest: createContentDigest(route),
      },
    });
  });

  //API Options

  // Zones
  let zones = await fetchData(`https://api.weather.gov/zones`)
  let zoneTypes: string[] = [];
  let zoneIds: { name: string, id: string, type: string }[] = []
  zones.features.forEach((zone: any) => {
    zoneIds.push({ name: zone.properties.name, id: zone.properties.id, type: zone.properties.type });
    if (zoneTypes.includes(zone.properties.type) == false) {
      zoneTypes.push(zone.properties.type);
    }
  });
  zoneTypes.forEach(type => {
    createNode({
      type,
      id: createNodeId(type), //[ pass a unique identifier here: [movie.id] for example
      parent: null,
      children: [],
      internal: {
        type: "zoneTypes", // name of collection in graphql schema
        contentDigest: createContentDigest(type),
      },
    });
  });
  zoneIds.forEach(item => {
    createNode({
      name: item.name,
      id: createNodeId(item.id), //[ pass a unique identifier here: [movie.id] for example
      zoneId: item.id,
      type: item.type,
      parent: null,
      children: [],
      internal: {
        type: "zoneOptions", // name of collection in graphql schema
        contentDigest: createContentDigest(item),
      },
    });
  });
};

async function fetchData(api: string) {
  let response = await eleventyFetch(
    api,
    {
      duration: "1d",
      type: "json",
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      directory: ".eleventy-cache",
    }
  );
  return response;
}
