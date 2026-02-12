import React from 'react';
import { useCreateKosForm } from './useCreateKosForm';
import { SectionBasicInfo } from './sections/SectionBasicInfo';
import { SectionLocation } from './sections/SectionLocation';
import { SectionFacilities } from './sections/SectionFacilities';
import { SectionCoordinates } from './sections/SectionCoordinates';
import { SubmitActions } from './sections/SubmitActions';
import { TipsPanel } from './sections/TipsPanel';
import { FormErrorAlert } from './FormErrorAlert';
import { KECAMATAN_SEMARANG, FACILITIES } from '@/lib/constants';

export type KosFormShellProps = Record<string, never>; // placeholder for future props without using empty interface

export const KosFormShell: React.FC<KosFormShellProps> = () => {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit, addFacility } = useCreateKosForm();

  // Use centralized constants for Kecamatan Semarang
  const cities = [...KECAMATAN_SEMARANG];

  const facilitiesOptions = [...FACILITIES];

  return (
    <>
      <FormErrorAlert message={errors.general} />
      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <SectionBasicInfo
            values={{
              title: formData.title,
              description: formData.description,
              name: formData.name,
              totalRooms: formData.totalRooms,
              occupiedRooms: formData.occupiedRooms,
            }}
            errors={errors}
            onChange={handleInputChange}
          />
          <SectionLocation
            address={formData.address}
            city={formData.city}
            price={formData.price}
            errors={errors}
            cities={cities}
            onChange={handleInputChange}
          />
          <SectionFacilities
            facilities={formData.facilities}
            errors={errors}
            suggestions={facilitiesOptions}
            onChange={e => handleInputChange(e)}
            onAdd={addFacility}
          />
          <SectionCoordinates
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleInputChange}
          />
          <SubmitActions isSubmitting={isSubmitting} onCancel={() => history.back()} />
        </form>
      </div>
      <TipsPanel />
    </>
  );
};