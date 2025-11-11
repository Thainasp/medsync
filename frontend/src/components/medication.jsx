import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2px;
  color: white;
  font-family: Nunito;
`;

const MedicationItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 6px;
  border-radius: 8px;
  font-family: Nunito;
  font-size: 1.2em;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RoundCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 12px;
  margin-top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: transparent;
  appearance: none;
  cursor: pointer;
  position: relative;
  
  &:checked {
    background: #4CAF50;
    border-color: #4CAF50;
  }
  
  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  }
`;

const MedicationInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: Nunito;
`;

const MedicationHeader = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  margin-bottom: 4px;
`;

const MedicationName = styled.span`
  font-weight: bold;
  font-size: 0.9em;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #e0e0e0;
`;

const MedicationTime = styled.span`
  font-size: 0.9em;
  color: white;
`;

const MedicationNote = styled.div`
  
  font-style: italic;
  color: white;
  align-self: flex-start;
`;

export function Medication({ name, time, note }) {
    return (
        <PageContainer className="inicio-container">
            <MedicationItem>
                <RoundCheckbox />
                <MedicationInfo>
                    <MedicationHeader>
                        <MedicationName>{name}</MedicationName>
                        <Divider />
                        <MedicationTime>{time}</MedicationTime>
                    </MedicationHeader>
                    {note && <MedicationNote>{note}</MedicationNote>}
                </MedicationInfo>
            </MedicationItem>
        </PageContainer>
    );
}