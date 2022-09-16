import { IPagedMonaiResponse } from 'common/helper/paging/paging.interface';

export interface IGetPayloadsQueryParams {
  pageNumber: string;
  pageSize: string;
}

export interface IMonaiPayloadResponse
  extends IPagedMonaiResponse<IMonaiPayload> {
  succeeded: boolean;
  errors: string[];
  message: string;
}

export interface IMonaiPayload {
  id: string;
  payload_id: string;
  workflows: string[];
  workflow_instance_ids: string[];
  file_count: number;
  correlation_id: string;
  bucket: string;
  calling_aetitle: string;
  called_aetitle: string;
  timestamp: string;
  files: any[];
  patient_details: IMonaiPayloadPatient;
}

export interface IMonaiPayloadPatient {
  patient_id: string;
  patient_name: string;
  patient_sex: string;
  patient_dob: string;
  patient_age: string;
  patient_hospital_id: string;
}
