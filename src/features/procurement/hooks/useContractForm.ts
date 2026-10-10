import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateContract } from '../queries/procurement.mutations';
import {
  contractFormSchema,
  type ContractFormValues,
} from '../schemas/procurement.schemas';
import type { Contract } from '../types/procurement.types';

export function useContractForm(onDone: (contract: Contract) => void) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'goods',
      method: 'open-tender',
      department: '',
      budget: undefined,
      submissionDeadline: '',
      items: [{ description: '', quantity: 1, unit: 'pcs' }],
      publish: true,
    },
  });
  const createContract = useCreateContract();

  const submit = form.handleSubmit((values) => {
    createContract.mutate(
      {
        title: values.title,
        description: values.description,
        category: values.category,
        method: values.method,
        department: values.department,
        budget: values.budget,
        submissionDeadline: values.submissionDeadline,
        items: values.items,
        publish: values.publish,
      },
      { onSuccess: onDone },
    );
  });

  return {
    form,
    submit,
    isPending: createContract.isPending,
    isError: createContract.isError,
  };
}
