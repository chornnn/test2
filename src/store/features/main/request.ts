import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDataFromCloudFunctionByName } from '../../../firebase';

enum mainCloudFuntionName {
  getHotLocations = 'getHotLocations',
  getAllLocations = 'getAllLocations',
  getLocationId = 'getLocationId',
  getLocation = 'getLocation',
  listGroupPosts = 'listGroupPosts'
}

/**
 * hotlocations
 * @returns
 */
export const getHotGroupsRequest = () => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    mainCloudFuntionName.listGroupPosts
  );

  return callableReturnMessage({
    "orderBy": "byPopularity",
    "category": null,
    "platform": null
  }).catch((error) => {
    console.log(error);
  });
};

export const getHotLocationsRequest = () => {
  return getDataFromCloudFunctionByName(mainCloudFuntionName.getHotLocations);
};

/**
 * all locations
 * @returns
 */
export const getAllLocationsRequest = () => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    mainCloudFuntionName.getAllLocations
  );

  return callableReturnMessage();
};

export const getLocationIdRequest = (location) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    mainCloudFuntionName.getLocationId
  );

  return callableReturnMessage(location);
};

export const getLocationRequest = (locationId) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    mainCloudFuntionName.getLocation
  );

  return callableReturnMessage({ locationId });
};
