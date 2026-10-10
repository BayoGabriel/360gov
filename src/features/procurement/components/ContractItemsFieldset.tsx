import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { AiAssist } from '../../../shared/components/AiAssist';
import fieldStyles from '../../../shared/components/FormField/fields.module.css';
import type { ContractFormValues } from '../schemas/procurement.schemas';
import styles from './procurement.module.css';

interface ContractItemsFieldsetProps {
  form: UseFormReturn<ContractFormValues>;
}

/** Editable list of contract deliverables (description / qty / unit). */
export function ContractItemsFieldset({ form }: ContractItemsFieldsetProps) {
  const { register, control, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const errors = formState.errors;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.fieldLabel}>
        Deliverables &amp; Scope Items
      </legend>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.itemRow}>
          <input
            className={`${fieldStyles.input} ${errors.items?.[index]?.description ? fieldStyles.invalid : ''}`}
            placeholder="Item or service description"
            aria-label={`Item ${index + 1} description`}
            {...register(`items.${index}.description`)}
          />
          <input
            className={`${fieldStyles.input} ${errors.items?.[index]?.quantity ? fieldStyles.invalid : ''}`}
            type="number"
            min={1}
            placeholder="Qty"
            aria-label={`Item ${index + 1} quantity`}
            {...register(`items.${index}.quantity`)}
          />
          <input
            className={`${fieldStyles.input} ${errors.items?.[index]?.unit ? fieldStyles.invalid : ''}`}
            placeholder="Unit"
            aria-label={`Item ${index + 1} unit`}
            {...register(`items.${index}.unit`)}
          />
          <AiAssist
            task="describe"
            purpose="contract-item-description"
            subject={
              form.watch(`items.${index}.description`) ||
              `Deliverable ${index + 1}`
            }
            context={`Contract: ${form.watch('title') || 'New tender'}.`}
            variant="icon"
            label="Write item description with AI"
            onApply={(text) =>
              form.setValue(`items.${index}.description`, text, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Remove item ${index + 1}`}
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
      {errors.items?.root ? (
        <p className={styles.errorText} role="alert">
          {errors.items.root.message}
        </p>
      ) : typeof errors.items?.message === 'string' ? (
        <p className={styles.errorText} role="alert">
          {errors.items.message}
        </p>
      ) : null}
      <div>
        <button
          type="button"
          className={styles.outlineButton}
          onClick={() => append({ description: '', quantity: 1, unit: 'pcs' })}
        >
          <Plus size={14} aria-hidden="true" />
          Add Item
        </button>
      </div>
    </fieldset>
  );
}
