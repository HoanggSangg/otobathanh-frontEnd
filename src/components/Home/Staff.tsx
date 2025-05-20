import React, { useEffect, useState, useRef } from 'react';
import { getAllCategoryStaffsAPI, getAllStaffAPI } from '../API/index.js';
import { SectionTitle } from '../Styles/StylesComponents';
import styled from 'styled-components';


const StaffSection = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  padding: 40px 0;
`;

const StaffContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  gap: 24px;
  flex-wrap: wrap;
`;

const CategorySection = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  margin: 0 12px;
`;

const CategoryTitle = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 28px;
  color: #222;
  margin-bottom: 8px;
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 3px;
    background-color: #e31837;
  }
`;

const StaffGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

interface CategoryType {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface StaffType {
    _id: string;
    name: string;
    position: string;
    phone: string;
    image?: string;
    categoryId?: string;
    catestaff_id?: {
        _id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

const StaffCard: React.FC<{ staff: StaffType }> = ({ staff }) => (
    <div style={{
        border: '1px solid #ddd',
        borderRadius: 6,
        padding: 16,
        margin: 8,
        width: 260,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    }}>
        <img
            src={staff?.image || 'https://via.placeholder.com/100x120?text=No+Image'}
            alt={staff?.name}
            style={{ 
                width: 120,
                height: 140,
                objectFit: 'cover',
                borderRadius: 6,
                marginBottom: 16
            }}
        />
        <div style={{ width: '100%', fontWeight: 700, fontSize: 18, color: '#333', marginBottom: 8 }}>{staff?.name}</div>
        <div style={{ width: '100%', fontWeight: 400, fontSize: 15, color: '#555', marginBottom: 12 }}>{staff?.position}</div>
        <div style={{ width: '100%', color: '#e53935', fontWeight: 500, fontSize: 15 }}>
            Liên hệ <span style={{ color: '#333' }}>| {staff?.phone}</span>
        </div>
    </div>
);

const Staff: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [staffsByCategory, setStaffsByCategory] = useState<Record<string, StaffType[]>>({});
    const [indexes, setIndexes] = useState<Record<string, number>>({});
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        Promise.all([
            getAllCategoryStaffsAPI(),
            getAllStaffAPI()
        ]).then(([catData, staffData]: [CategoryType[], StaffType[]]) => {
            const validCategories = catData || [];
            const validStaffs = staffData || [];
            
            setCategories(validCategories);
            
            const staffGroups: Record<string, StaffType[]> = {};
            validCategories.forEach((cat) => {
                staffGroups[cat._id] = validStaffs.filter(staff => staff.catestaff_id?._id === cat._id);
            });
            
            setStaffsByCategory(staffGroups);
            
            const initialIndexes: Record<string, number> = {};
            validCategories.forEach((cat) => {
                initialIndexes[cat._id] = 0;
            });
            setIndexes(initialIndexes);
        });
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    useEffect(() => {
        if (!categories.length) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setIndexes(prev => {
                const next: Record<string, number> = { ...prev };
                categories.forEach((cat) => {
                    const staffs = staffsByCategory[cat._id] || [];
                    if (staffs.length > 2) {
                        next[cat._id] = (prev[cat._id] + 2) % staffs.length;
                    }
                });
                return next;
            });
        }, 3000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [categories, staffsByCategory]);

    return (
        <StaffSection>
            <StaffContainer>
                <SectionTitle>TƯ VẤN</SectionTitle>
                <CategoryContainer>
                    {categories.map((cat) => {
                        const staffs = staffsByCategory[cat._id] || [];
                        const currentIndex = indexes[cat._id] || 0;
                        const displayStaffs = staffs.length <= 2
                            ? staffs
                            : [
                                ...staffs.slice(currentIndex, currentIndex + 2),
                                ...(currentIndex + 2 > staffs.length ? staffs.slice(0, (currentIndex + 2) % staffs.length) : [])
                            ];

                        return (
                            <CategorySection key={cat._id}>
                                <CategoryTitle>{cat.name}</CategoryTitle>
                                <StaffGrid>
                                    {displayStaffs.map((staff, i) => (
                                        <StaffCard key={`${staff._id}-${i}`} staff={staff} />
                                    ))}
                                </StaffGrid>
                            </CategorySection>
                        );
                    })}
                </CategoryContainer>
            </StaffContainer>
        </StaffSection>
    );
};

export default Staff;
