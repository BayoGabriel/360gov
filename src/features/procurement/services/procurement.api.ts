import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  Bid,
  Contract,
  ContractActivity,
  ContractDocument,
  ContractFilterOptions,
  ContractListQuery,
  ContractListResult,
  ContractMessage,
  CreateContractInput,
  ProcurementApi,
  UploadDocumentInput,
} from '../types/procurement.types';
import { devProcurementApi } from './procurement.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET  /procurement/contracts?view&page&query&category&method&department&from&to
 *                                             -> { items, page, totalPages, total }
 *   GET  /procurement/contracts/{id}                      -> Contract
 *   GET  /procurement/filter-options                      -> ContractFilterOptions
 *   GET  /procurement/contracts/{id}/bids                 -> Bid[]
 *   GET  /procurement/contracts/{id}/bids/{bidId}/messages -> ContractMessage[]
 *   POST /procurement/contracts/{id}/bids/{bidId}/messages { body } -> ContractMessage
 *   GET  /procurement/contracts/{id}/activity             -> ContractActivity[]
 *   POST /procurement/contracts            CreateContractInput -> Contract
 *   POST /procurement/contracts/{id}/actions { action }   -> Contract
 *   POST /procurement/contracts/{id}/bids/{bidId}/status  { status } -> Bid
 *   POST /procurement/contracts/{id}/bids/{bidId}/adjustment { note } -> 204
 *   POST /procurement/contracts/{id}/bids/{bidId}/award   -> Contract
 *   POST /procurement/contracts/{id}/documents UploadDocumentInput -> ContractDocument
 *   POST /procurement/contracts/{id}/documents/{docId}/signature-request -> 204
 *   POST /procurement/contracts/{id}/documents/{docId}/sign { party } -> 204
 */
function toSearchParams(query: ContractListQuery): string {
  const params = new URLSearchParams({
    view: query.view,
    page: String(query.page),
  });
  if (query.query) params.set('query', query.query);
  if (query.category) params.set('category', query.category);
  if (query.method) params.set('method', query.method);
  if (query.department) params.set('department', query.department);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return params.toString();
}

const httpProcurementApi: ProcurementApi = {
  list: (query) =>
    apiClient.get<ContractListResult>(
      `/procurement/contracts?${toSearchParams(query)}`,
      { signal: query.signal },
    ),
  getContract: (contractId, signal) =>
    apiClient.get<Contract>(`/procurement/contracts/${contractId}`, {
      signal,
    }),
  listFilterOptions: (signal) =>
    apiClient.get<ContractFilterOptions>('/procurement/filter-options', {
      signal,
    }),
  listBids: (contractId, signal) =>
    apiClient.get<Bid[]>(`/procurement/contracts/${contractId}/bids`, {
      signal,
    }),
  listMessages: (contractId, bidId, signal) =>
    apiClient.get<ContractMessage[]>(
      `/procurement/contracts/${contractId}/bids/${bidId}/messages`,
      { signal },
    ),
  sendMessage: (contractId, bidId, body) =>
    apiClient.post<ContractMessage>(
      `/procurement/contracts/${contractId}/bids/${bidId}/messages`,
      { body },
    ),
  listActivity: (contractId, signal) =>
    apiClient.get<ContractActivity[]>(
      `/procurement/contracts/${contractId}/activity`,
      { signal },
    ),
  createContract: (input: CreateContractInput) =>
    apiClient.post<Contract>('/procurement/contracts', input),
  runContractAction: (contractId, action) =>
    apiClient.post<Contract>(`/procurement/contracts/${contractId}/actions`, {
      action,
    }),
  setBidStatus: (contractId, bidId, status) =>
    apiClient.post<Bid>(
      `/procurement/contracts/${contractId}/bids/${bidId}/status`,
      { status },
    ),
  requestAdjustment: (contractId, bidId, note) =>
    apiClient.post(
      `/procurement/contracts/${contractId}/bids/${bidId}/adjustment`,
      { note },
    ),
  awardContract: (contractId, bidId) =>
    apiClient.post<Contract>(
      `/procurement/contracts/${contractId}/bids/${bidId}/award`,
      undefined,
    ),
  uploadDocument: (contractId, input: UploadDocumentInput) =>
    apiClient.post<ContractDocument>(
      `/procurement/contracts/${contractId}/documents`,
      input,
    ),
  sendForSignature: (contractId, documentId) =>
    apiClient.post(
      `/procurement/contracts/${contractId}/documents/${documentId}/signature-request`,
      undefined,
    ),
  signDocument: (contractId, documentId, party) =>
    apiClient.post(
      `/procurement/contracts/${contractId}/documents/${documentId}/sign`,
      { party },
    ),
};

export const procurementApi: ProcurementApi = env.apiBaseUrl
  ? httpProcurementApi
  : devProcurementApi;
