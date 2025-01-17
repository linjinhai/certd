import { request } from "/src/api/service";

const apiPrefix = "/pi/pipeline";
const historyApiPrefix = "/pi/history";

export function GetList(query: any) {
  return request({
    url: apiPrefix + "/page",
    method: "post",
    data: query
  });
}

export function AddObj(obj: any) {
  return request({
    url: apiPrefix + "/add",
    method: "post",
    data: obj
  });
}

export function UpdateObj(obj: any) {
  return request({
    url: apiPrefix + "/update",
    method: "post",
    data: obj
  });
}

export function DelObj(id: any) {
  return request({
    url: apiPrefix + "/delete",
    method: "post",
    params: { id }
  });
}

export function GetObj(id: any) {
  return request({
    url: apiPrefix + "/info",
    method: "post",
    params: { id }
  });
}

export function GetDetail(id: any) {
  return request({
    url: apiPrefix + "/detail",
    method: "post",
    params: { id }
  });
}

export function Save(pipelineEntity: any) {
  return request({
    url: apiPrefix + "/save",
    method: "post",
    data: pipelineEntity
  });
}

export function Trigger(id: any, stepId?: string) {
  return request({
    url: apiPrefix + "/trigger",
    method: "post",
    params: { id, stepId }
  });
}

export function Cancel(historyId: any) {
  return request({
    url: apiPrefix + "/cancel",
    method: "post",
    params: { historyId }
  });
}

export async function GetFiles(pipelineId: number) {
  return request({
    url: historyApiPrefix + "/files",
    method: "post",
    params: { pipelineId }
  });
}
