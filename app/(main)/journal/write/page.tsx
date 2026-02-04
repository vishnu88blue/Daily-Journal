'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMoodById, MOODS } from '@/assets/data/Moods';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import 'react-quill-new/dist/quill.snow.css';
import { journalSchema } from '@/assets/constants/FormScheme';
import CollectionForm from '@/components/collection-form/CollectionForm';
import { useCreateCollectionMutation } from '@/lib/api/database/collection/create-collection';
import { getCollectionQuery } from '@/lib/api/database/collection/get-collection';
import { useGetJournalEntryQuery } from '@/lib/api/database/journal/get-journal-entry';
import { getJournalDraftQuery } from '@/lib/api/database/journal/get-draft';
import { CreateCollectionRequest } from '@/lib/api/database/collections';
import { useSaveDraftMutation } from '@/lib/api/database/journal/save-draft';
import { useCreateJournalEntryMutation } from '@/lib/api/database/journal/create-journal-entry';
import { useUpdateJournalEntryMutation } from '@/lib/api/database/journal/update-journal-entry';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function JournalEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // Use state
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] =
    useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // API calls
  const {
    refetch,
    data: collectionsQueryData,
    isFetching,
  } = getCollectionQuery();
  const {
    refetch: refetchDraft,
    data: draftData,
    isFetching: draftIsFetching,
    isSuccess: draftIsSuccess,
  } = getJournalDraftQuery(false);
  const {
    data: journalEntryData,
    refetch: refetchJournalEntry,
    isFetching: journalEntryIsFetching,
  } = useGetJournalEntryQuery({ id: editId ?? '' }, false);
  const useCreateCollection = useCreateCollectionMutation();
  const saveDraftMutation = useSaveDraftMutation();
  const createJournalEntryMutation = useCreateJournalEntryMutation();
  const updateJournalEntryMutation = useUpdateJournalEntryMutation();

  const journalEntryLoading = isEditMode
    ? updateJournalEntryMutation.isPending
    : createJournalEntryMutation.isPending;

  const journalEntrySuccess = isEditMode
    ? updateJournalEntryMutation.isSuccess
    : createJournalEntryMutation.isSuccess;

  const journalEntryDataResult = isEditMode
    ? updateJournalEntryMutation.data
    : createJournalEntryMutation.data;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: '',
      content: '',
      mood: '',
      collectionId: '',
    },
  });

  // Handle draft or existing entry loading
  useEffect(() => {
    refetch();
    if (editId) {
      setIsEditMode(true);
      refetchJournalEntry();
    } else {
      setIsEditMode(false);
      refetchDraft();
    }
  }, [editId]);

  // Handle setting form data from draft
  useEffect(() => {
    if (isEditMode && journalEntryData) {
      reset({
        title: journalEntryData?.title || '',
        content: journalEntryData?.content || '',
        mood: journalEntryData?.mood || '',
        collectionId: journalEntryData?.collectionId || '',
      });
    } else if (draftIsSuccess && draftData) {
      reset({
        title: draftData.title || '',
        content: draftData.content || '',
        mood: draftData.mood || '',
        collectionId: '',
      });
    } else {
      reset({
        title: '',
        content: '',
        mood: '',
        collectionId: '',
      });
    }
  }, [draftData, isEditMode, journalEntryData]);

  // Handle collection creation success
  useEffect(() => {
    if (useCreateCollection.isSuccess) {
      setIsCollectionDialogOpen(false);
      refetch();
      setValue('collectionId', useCreateCollection.data.id);
      toast.success(`Collection ${useCreateCollection.data.name} created!`);
    } else if (useCreateCollection.isError) {
      toast.error(`Error: ${useCreateCollection.error.message}`);
    }
  }, [useCreateCollection.isPending]);

  // Handle successful submission
  useEffect(() => {
    if (journalEntrySuccess) {
      // Clear draft after successful publish
      if (!isEditMode) {
        saveDraftMutation.mutate({ title: '', content: '', mood: '' });
      }

      router.push(
        `/collection/${
          journalEntryDataResult?.collectionId
            ? journalEntryDataResult.collectionId
            : 'unorganized'
        }`,
      );

      toast.success(
        `Entry ${isEditMode ? 'updated' : 'created'} successfully!`,
      );
    }
  }, [journalEntryLoading]);

  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data?.mood);
    if (isEditMode) {
      updateJournalEntryMutation.mutate({
        ...data,
        id: editId ?? '',
        moodQuery: mood?.pixabayQuery ?? '',
      });
    } else {
      createJournalEntryMutation.mutate({
        ...data,
        moodQuery: mood?.pixabayQuery ?? '',
      });
    }
  });

  const formData = watch();

  const handleSaveDraft = async () => {
    if (!isDirty) {
      toast.error('No changes to save');
      return;
    }
    saveDraftMutation.mutate(formData);
    if (saveDraftMutation.isSuccess) {
      toast.success('Draft saved successfully');
    }
  };

  const handleCreateCollection = async (data: CreateCollectionRequest) => {
    useCreateCollection.mutate(data);
  };

  const isLoading =
    isFetching ||
    journalEntryIsFetching ||
    draftIsFetching ||
    journalEntryLoading ||
    saveDraftMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-2  mx-auto">
        <h1 className="text-5xl md:text-6xl gradient-title">
          {isEditMode ? 'Edit Entry' : "What's on your mind?"}
        </h1>

        {isLoading && (
          <BarLoader className="mb-4" width={'100%'} color="orange" />
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            disabled={isLoading}
            {...register('title')}
            placeholder="Give your entry a title..."
            className={`py-5 md:text-md ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={errors.mood ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MOODS).map((mood) => (
                    <SelectItem key={mood.id} value={mood.id}>
                      <span className="flex items-center gap-2">
                        {mood.emoji} {mood.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {getMoodById(getValues('mood'))?.prompt ?? 'Write your thoughts...'}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link'],
                    ['clean'],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Add to Collection (Optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === 'new') {
                    setIsCollectionDialogOpen(true);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collectionsQueryData?.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="text-orange-600">
                      + Create New Collection
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-x-4 flex">
          {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending || !isDirty}
            >
              {saveDraftMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save as Draft
            </Button>
          )}
          <Button
            type="submit"
            variant="loginButton"
            disabled={journalEntryLoading || !isDirty}
          >
            {journalEntryLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditMode ? 'Update' : 'Publish'}
          </Button>
          {isEditMode && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${journalEntryData?.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <CollectionForm
        loading={useCreateCollection.isPending}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
}
