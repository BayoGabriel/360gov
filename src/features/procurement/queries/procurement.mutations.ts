import { useMutation, useQueryClient } from '@tanstack/react-query';
import { procurementApi } from '../services/procurement.api';
import type {
  BidStatus,
  ContractAction,
  ContractMessage,
  CreateContractInput,
  SignaturePartyRole,
  UploadDocumentInput,
} from '../types/procurement.types';
import { procurementKeys } from './procurement.queries';

function useInvalidateContract(contractId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({
      queryKey: procurementKeys.contract(contractId),
    });
    void queryClient.invalidateQueries({
      queryKey: procurementKeys.bids(contractId),
    });
    void queryClient.invalidateQueries({
      queryKey: procurementKeys.activity(contractId),
    });
    void queryClient.invalidateQueries({ queryKey: procurementKeys.lists() });
  };
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateContractInput) =>
      procurementApi.createContract(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: procurementKeys.lists() }),
  });
}

export function useContractAction(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: (action: ContractAction) =>
      procurementApi.runContractAction(contractId, action),
    onSuccess: invalidate,
  });
}

export function useSetBidStatus(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: ({ bidId, status }: { bidId: string; status: BidStatus }) =>
      procurementApi.setBidStatus(contractId, bidId, status),
    onSuccess: invalidate,
  });
}

export function useRequestAdjustment(contractId: string, bidId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: (note: string) =>
      procurementApi.requestAdjustment(contractId, bidId, note),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: procurementKeys.messages(contractId, bidId),
      });
    },
  });
}

export function useAwardContract(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: (bidId: string) =>
      procurementApi.awardContract(contractId, bidId),
    onSuccess: invalidate,
  });
}

export function useUploadContractDocument(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: (input: UploadDocumentInput) =>
      procurementApi.uploadDocument(contractId, input),
    onSuccess: invalidate,
  });
}

export function useSendForSignature(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: (documentId: string) =>
      procurementApi.sendForSignature(contractId, documentId),
    onSuccess: invalidate,
  });
}

export function useSignDocument(contractId: string) {
  const invalidate = useInvalidateContract(contractId);
  return useMutation({
    mutationFn: ({
      documentId,
      party,
    }: {
      documentId: string;
      party: SignaturePartyRole;
    }) => procurementApi.signDocument(contractId, documentId, party),
    onSuccess: invalidate,
  });
}

export function useSendBidMessage(contractId: string, bidId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      procurementApi.sendMessage(contractId, bidId, body),
    onSuccess: (message) => {
      queryClient.setQueryData<ContractMessage[]>(
        procurementKeys.messages(contractId, bidId),
        (prev) => [...(prev ?? []), message],
      );
      void queryClient.invalidateQueries({
        queryKey: procurementKeys.activity(contractId),
      });
    },
  });
}
