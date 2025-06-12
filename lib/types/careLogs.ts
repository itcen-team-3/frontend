interface CareItem {
  id: string;
  name: string;
  type: string;
}

interface CaregiverCareLogActivityItem {
  careItemType: string;
  careItemName: string;
  requiredMinutes: number;
}

interface CaregiverCareLogImageItem {
  imageType: string;
  imageUrl: string;
}

export {
  type CareItem,
  type CaregiverCareLogActivityItem,
  type CaregiverCareLogImageItem,
};
