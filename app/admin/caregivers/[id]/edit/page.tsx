import { CaregiverForm } from "@/components/caregivers/caregiver-form";

export default function EditCaregiverPage() {
  // 실제 구현에서는 ID를 기반으로 데이터를 가져옵니다
  const mockData = {
    name: "김요양",
    age: "45",
    address: "서울시 강남구",
    phone: "010-1234-5678",
    bio: "10년 경력의 요양보호사입니다. 환자 케어에 최선을 다하겠습니다.",
    imageUrl: "/diverse-woman-portrait.png",
    licenseNumber: "LC-2020-001234",
    experience: "10",
  };

  return <CaregiverForm mode="edit" initialData={mockData} />;
}
