import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { procurementApi } from '../services/procurement.api';
import type { ContractListQuery } from '../types/procurement.types';

export const procurementKeys = {
  all: ['procurement'] as const,
  lists: () => [...procurementKeys.all, 'list'] as const,
  list: (query: Omit<ContractListQuery, 'signal'>) =>
    [...procurementKeys.lists(), query] as const,
  filterOptions: () => [...procurementKeys.all, 'filter-options'] as const,
  contract: (contractId: string) =>
    [...procurementKeys.all, 'contract', contractId] as const,
  bids: (contractId: string) =>
    [...procurementKeys.all, 'bids', contractId] as const,
  messages: (contractId: string, bidId: string) =>
    [...procurementKeys.all, 'messages', contractId, bidId] as const,
  activity: (contractId: string) =>
    [...procurementKeys.all, 'activity', contractId] as const,
};

export function useContractList(query: Omit<ContractListQuery, 'signal'>) {
  return useQuery({
    queryKey: procurementKeys.list(query),
    queryFn: ({ signal }) => procurementApi.list({ ...query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useContractFilterOptions() {
  return useQuery({
    queryKey: procurementKeys.filterOptions(),
    queryFn: ({ signal }) => procurementApi.listFilterOptions(signal),
    staleTime: 5 * 60_000,
  });
}

export function useContract(contractId: string | undefined) {
  return useQuery({
    queryKey: procurementKeys.contract(contractId ?? ''),
    queryFn: ({ signal }) =>
      procurementApi.getContract(contractId ?? '', signal),
    enabled: Boolean(contractId),
  });
}

export function useContractBids(contractId: string | undefined) {
  return useQuery({
    queryKey: procurementKeys.bids(contractId ?? ''),
    queryFn: ({ signal }) =>
      procurementApi.listBids(contractId ?? '', signal),
    enabled: Boolean(contractId),
  });
}

export function useBidMessages(
  contractId: string | undefined,
  bidId: string | undefined,
) {
  return useQuery({
    queryKey: procurementKeys.messages(contractId ?? '', bidId ?? ''),
    queryFn: ({ signal }) =>
      procurementApi.listMessages(contractId ?? '', bidId ?? '', signal),
    enabled: Boolean(contractId && bidId),
  });
}

export function useContractActivity(contractId: string | undefined) {
  return useQuery({
    queryKey: procurementKeys.activity(contractId ?? ''),
    queryFn: ({ signal }) =>
      procurementApi.listActivity(contractId ?? '', signal),
    enabled: Boolean(contractId),
  });
}
