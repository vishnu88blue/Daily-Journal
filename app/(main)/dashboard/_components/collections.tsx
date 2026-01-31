'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CollectionPreview from './collection-preview';
import CollectionForm from '@/components/collection-form/CollectionForm';
import { useCreateCollectionMutation } from '@/api/database/collection/create-collection';
import { CreateCollectionRequest } from '@/api/database/collections';
import { getCollectionQuery } from '@/api/database/collection/get-collection';

const Collections = ({ entriesByCollection }) => {
  // Use States
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] =
    useState<boolean>(false);

  // API calls
  const collections = getCollectionQuery();
  const useCreateCollection = useCreateCollectionMutation();

  useEffect(() => {
    if (useCreateCollection.isSuccess) {
      // eslint-disable-next-line
      setIsCollectionDialogOpen((prev) => (prev ? false : prev));
      toast.success(`Collection ${useCreateCollection.data.name} created!`);
    } else if (useCreateCollection.isError) {
      toast.error(`Error: ${useCreateCollection.error.message}`);
    }
  }, [useCreateCollection.isPending]);

  const handleCreateCollection = async (data: CreateCollectionRequest) => {
    useCreateCollection.mutate(data);
  };

  if (collections?.data?.length === 0) return <></>;

  return (
    <section id="collections" className="space-y-6">
      <h2 className="text-3xl font-bold gradient-title">Collections</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Collection Button */}
        <CollectionPreview
          isCreateNew={true}
          onCreateNew={() => setIsCollectionDialogOpen(true)}
        />

        {/* Unorganized Collection */}
        {entriesByCollection?.unorganized?.length > 0 && (
          <CollectionPreview
            name="Unorganized"
            entries={entriesByCollection.unorganized}
            isUnorganized={true}
          />
        )}

        {/* User Collections */}
        {collections?.data?.map((collection) => (
          <CollectionPreview
            key={collection.id}
            id={collection.id}
            name={collection.name}
            entries={entriesByCollection[collection.id] || []}
          />
        ))}

        <CollectionForm
          loading={useCreateCollection.isPending}
          onSuccess={handleCreateCollection}
          open={isCollectionDialogOpen}
          setOpen={setIsCollectionDialogOpen}
        />
      </div>
    </section>
  );
};

export default Collections;
