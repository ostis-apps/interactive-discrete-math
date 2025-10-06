import { validatePassword } from './auth-utils'
import CryptoJS from 'crypto-js'


import { ScAddr, ScClient, ScTemplate, ScType, ScHelper, ScConstruction, ScLinkContent, ScLinkContentType } from 'ts-sc-client';

const client = new ScClient('ws://localhost:8090/ws_json');
const helper = new ScHelper(client);


export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: string;
  accessToken?: string;
}

const initiateActionAndGetResult = async (actionClass: ScAddr, actionParams: ScAddr[]) => {
  const actionAlias = "action";

  const construction = new ScConstruction();
  construction.generateNode(ScType.ConstNode, actionAlias);
  construction.generateConnector(ScType.ConstPermPosArc, actionClass, actionAlias);

  for (let i = 0; i < actionParams.length; i++) {
    const arcAlias = `arc_${i}`;
    const relationIdtf = `rrel_${i + 1}`;
    const relationAddrKey = `rrel${i + 1}`;
    const relationObject = await client.searchKeynodes(relationIdtf);
    const relationAddr = relationObject[relationAddrKey];
    construction.generateConnector(ScType.ConstPermPosArc, actionAlias, actionParams[i], arcAlias);
    construction.generateConnector(ScType.ConstPermPosArc, relationAddr, arcAlias);
  }

  const res = await client.generateElements(construction);
  const actionAddr = res[0];
  const initiateActionConstruction = new ScConstruction();
  const { actionInitiated } = await client.searchKeynodes("action_initiated");

  initiateActionConstruction.generateConnector(
      ScType.ConstPermPosArc,
      actionInitiated,
      actionAddr
  );
  const result = await client.generateElements(initiateActionConstruction);
  return {result: await helper.getResult(actionAddr), action: actionAddr};
};

const getUserFromResult = async(resultAddr: ScAddr) => {
  const template = new ScTemplate();
  template.triple(
    resultAddr,
    ScType.VarPermPosArc,
    [ScType.VarNode, "_user"]
  );
  const searchResult = await client.searchByTemplate(template);
  if (searchResult.length > 0) {
    return searchResult[0].get("_user");
  } else {
    return null;
  }
};

const isActionSuccessfull = async(actionAddr: ScAddr) => {
  const { actionFinishedSuccessfully } = await client.searchKeynodes("action_finished_successfully");
  const template = new ScTemplate();
  template.triple(
    actionFinishedSuccessfully,
    ScType.VarPermPosArc,
    actionAddr
  );
  const searchResult = await client.searchByTemplate(template);
  return searchResult.length > 0;
}

const getErrorMessage = async(actionAddr: ScAddr) => {
  const { nrelErrorMessage } = await client.searchKeynodes("nrel_error_message");
  const template = new ScTemplate();
  template.quintuple(
    actionAddr,
    ScType.VarCommonArc,
    [ScType.VarNodeLink, "_error_link"],
    ScType.VarPermPosArc,
    nrelErrorMessage
  );
  const searchResult = await client.searchByTemplate(template);
  if (searchResult.length > 0) {
    const errorMessageLink = searchResult[0].get("_error_link");
    const message = (await client.getLinkContents([errorMessageLink]))[0].data;
    return message;
  }
  return "Unknown Error";
}

export async function registerUser(login: string, password: string): Promise<AuthResponse> {
  const passwordError = validatePassword(password);
  if (passwordError) {
    return {success: false, error: passwordError};
  }

  try {
    const firstHash = CryptoJS.SHA256(password).toString();
    
    const {actionRegisterUser} = await client.searchKeynodes("action_register_user");
    
    const links = new ScConstruction();
    links.generateLink(
      ScType.ConstNodeLink,
      new ScLinkContent(login, ScLinkContentType.String),
      "username");
    links.generateLink(
      ScType.ConstNodeLink,
      new ScLinkContent(firstHash, ScLinkContentType.String),
      "password");
    
    const generatedLinks = await client.generateElements(links);
    
    const pair = await initiateActionAndGetResult(actionRegisterUser, [generatedLinks[0], generatedLinks[1]]);
    const res = pair.result;
    const actionAddr = pair.action;
    if (await isActionSuccessfull(actionAddr)) {
      const userAddr = await getUserFromResult(res);
      return {"success": true, "message": login + "is registered"};
    } else {
      return {success: false, error: await getErrorMessage(actionAddr)};
    }
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: 'Network error' };
  }
}

export async function loginUser(login: string, password: string): Promise<AuthResponse> {
  if (!login || !password) {
    return {success: false, error: 'Логин и пароль обязательны'};
  }

  try {
    const firstHash = CryptoJS.SHA256(password).toString();
    
    const {actionLoginUser} = await client.searchKeynodes("action_login_user");
    
    const links = new ScConstruction();
    links.generateLink(
      ScType.ConstNodeLink,
      new ScLinkContent(login, ScLinkContentType.String),
      "username");
    links.generateLink(
      ScType.ConstNodeLink,
      new ScLinkContent(firstHash, ScLinkContentType.String),
      "password");
    
    const generatedLinks = await client.generateElements(links);
    
    const pair = await initiateActionAndGetResult(actionLoginUser, [generatedLinks[0], generatedLinks[1]]);
    
    const res = pair.result;
    const actionAddr = pair.action;
    if (await isActionSuccessfull(actionAddr)) {
      const userAddr = await getUserFromResult(res);
      return {"success": true, "user": login, "accessToken": login};
    } else {
      return {success: false, error: await getErrorMessage(actionAddr)};
    }
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: 'Network error' };
  }
}
