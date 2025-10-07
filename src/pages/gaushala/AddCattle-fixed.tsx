// Lines 219-270 replacement for handleSubmit function
    try {
      // Transform formData to match Cattle interface for backend - COMPLETE FIELD MAPPING
      const cattleData: Omit<Cattle, 'id' | 'createdAt' | 'updatedAt'> = {
        uniqueAnimalId: formData.uniqueAnimalId,
        name: formData.name || undefined,
        breedId: formData.breedId,
        speciesId: formData.speciesId,
        genderId: formData.genderId,
        colorId: formData.colorId,
        dob: formData.ageYears > 0 ? calculateDobFromAge(formData.ageYears) : new Date().toISOString(),

        // Physical Characteristics
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        hornStatus: formData.hornStatus || undefined,
        rfidTagNo: formData.rfidTagNo,
        earTagNo: formData.earTagNumber || undefined,
        microchipNo: formData.microchipNumber || undefined,
        shedNumber: formData.shedNumber || undefined,

        // Health & Medical Records
        vaccinationStatus: formData.vaccinationStatus || undefined,
        disability: formData.disability || undefined,
        dewormingSchedule: formData.dewormingSchedule || undefined,
        medicalHistory: formData.medicalHistory || undefined,
        lastHealthCheckupDate: formData.lastHealthCheckup ? convertToLocalDateTime(formData.lastHealthCheckup) : undefined,
        vetName: formData.veterinarianName || undefined,
        vetContact: formData.veterinarianContact || undefined,

        // Reproductive Details
        milkingStatus: formData.milkingStatus || undefined,
        lactationNumber: formData.lactationNumber ? parseInt(formData.lactationNumber) : undefined,
        milkYieldPerDay: formData.milkYieldPerDay ? parseFloat(formData.milkYieldPerDay) : undefined,
        lastCalvingDate: formData.lastCalvingDate ? convertToLocalDateTime(formData.lastCalvingDate) : undefined,
        calvesCount: formData.numberOfCalves ? parseInt(formData.numberOfCalves) : undefined,
        pregnancyStatus: formData.pregnancyStatus || undefined,

        // Origin & Ownership
        sourceId: formData.sourceOfAcquisition ? parseInt(formData.sourceOfAcquisition) : undefined,
        dateOfAcquisition: formData.dateOfAcquisition ? convertToLocalDateTime(formData.dateOfAcquisition) : undefined,
        previousOwner: formData.previousOwner || undefined,
        ownershipId: formData.ownershipStatus ? parseInt(formData.ownershipStatus) : undefined,

        // Shelter & Feeding
        feedingSchedule: formData.feedingSchedule || undefined,
        feedTypeId: formData.typeOfFeed ? parseInt(formData.typeOfFeed) : undefined,

        // System fields
        dateOfEntry: convertToLocalDateTime(formData.dateOfEntry),
        isActive: true,
        totalDungCollected: 0,
        lastDungCollection: 0,
      };
