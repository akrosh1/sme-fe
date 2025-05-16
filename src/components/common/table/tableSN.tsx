import React, { useEffect, useState } from 'react';

interface TableSNProps {
  index: number;
  currentPage: number;
  pageSize: number;
  rowIndex?: number;
}

const TableSN: React.FC<TableSNProps> = ({
  index,
  currentPage,
  pageSize,
  rowIndex,
}) => {
  const [serialNumber, setSerialNumber] = useState<number>(0);

  useEffect(() => {
    const calculateSerialNumber = () => {
      const pageStart = (currentPage - 1) * pageSize;
      const calculatedIndex = rowIndex !== undefined ? rowIndex : index;
      return pageStart + calculatedIndex + 1;
    };

    setSerialNumber(calculateSerialNumber());
  }, [currentPage, pageSize, index, rowIndex]);

  return <>{serialNumber}</>;
};

export default TableSN;
