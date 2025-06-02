import { PatientForm } from "@/components/patients/patient-form";

export default function EditPatientPage() {
  // 실제 구현에서는 ID를 기반으로 데이터를 가져옵니다
  const mockData = {
    name: "이환자",
    age: "78",
    address: "서울시 강남구",
    phone: "010-1234-5678",
    medicalNotes: "고혈압 약 복용 중, 거동이 불편하여 휠체어 사용",
    familyContact: "010-9876-5432 (아들)",
    imageUrl: "/elderly-woman-knitting.png",
    careGrade: "3",
  };

  return <PatientForm mode="edit" initialData={mockData} />;
}
