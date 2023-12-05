import React, { useState, useEffect } from "react";
import "../styles/SplitModal.css";

function SplitModal({
  onMethodChange,
  onAmountsChange,
  showModal,
  totalAmount,
  participants,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("equally");
  const [participantPercentages, setParticipantPercentages] = useState({});
  const [participantAmounts, setParticipantAmounts] = useState({});
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    // Reset amounts and percentages when the split method changes
    setParticipantAmounts({});
    setParticipantPercentages({});
    setValidationMessage("");
  }, [activeTab]);

  const handlePercentageChange = (event, participantId) => {
    const percentageValue = event.target.value;
    const newPercentages = {
      ...participantPercentages,
      [participantId]: percentageValue === "" ? 0 : parseFloat(percentageValue),
    };
    setParticipantPercentages(newPercentages);
  };

  const handleAmountChange = (event, participantId) => {
    const amountValue = event.target.value;
    const newAmounts = {
      ...participantAmounts,
      [participantId]: amountValue === "" ? 0 : parseFloat(amountValue),
    };
    setParticipantAmounts(newAmounts);
  };

  const calculateAmount = (participantId, totalAmount, percentages) => {
    const percentage = percentages[participantId] || 0;
    return totalAmount * (percentage / 100);
  };

  const handleSave = () => {
    let totalPercentage = 0;
    let totalAmountSplit = 0;

    if (activeTab === "percentage") {
      totalPercentage = Object.values(participantPercentages).reduce(
        (acc, value) => acc + value,
        0
      );
      if (totalPercentage > 100) {
        setValidationMessage("Total percentage cannot exceed 100%");
        return;
      }
      if (totalPercentage !== 100) {
        setValidationMessage("Total percentage must equal exactly 100%");
        return;
      }
    } else if (activeTab === "amount") {
      totalAmountSplit = Object.values(participantAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
      if (totalAmountSplit > totalAmount) {
        setValidationMessage(
          `Total amount cannot exceed $${totalAmount.toFixed(2)}`
        );
        return;
      }
      if (totalAmountSplit !== totalAmount) {
        setValidationMessage(
          `Total amount split must equal exactly $${totalAmount.toFixed(2)}`
        );
        return;
      }
    }

    setValidationMessage("");

    if (activeTab === "equally") {
      const equalAmount = parseFloat(totalAmount) / participants.length;
      const amounts = participants.reduce((acc, participant) => {
        acc[participant._id] = equalAmount;
        return acc;
      }, {});
      onAmountsChange(amounts);
    } else if (activeTab === "percentage") {
      const amounts = Object.keys(participantPercentages).reduce(
        (acc, participantId) => {
          const amount = calculateAmount(
            participantId,
            totalAmount,
            participantPercentages
          );
          acc[participantId] = amount;
          participantAmounts[participantId] = amount;
          return acc;
        },
        {}
      );
      onAmountsChange(amounts);
    } else {
      onAmountsChange(participantAmounts);
    }
    onMethodChange(activeTab);
  };

  const calculateRemaining = () => {
    if (activeTab === "percentage") {
      const totalPercentageAssigned = Object.values(
        participantPercentages
      ).reduce((acc, value) => acc + value, 0);
      return 100 - totalPercentageAssigned;
    } else if (activeTab === "amount") {
      const totalAmountAssigned = Object.values(participantAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
      return totalAmount - totalAmountAssigned;
    }
    return 0;
  };

  return (
    showModal && (
      <div className="split-modal">
        <div className="split-modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <div className="tab">
            <button
              className={activeTab === "equally" ? "active" : ""}
              onClick={() => {
                setActiveTab("equally");
              }}
            >
              =
            </button>
            <button
              className={activeTab === "percentage" ? "active" : ""}
              onClick={() => {
                setActiveTab("percentage");
              }}
            >
              %
            </button>
            <button
              className={activeTab === "amount" ? "active" : ""}
              onClick={() => {
                setActiveTab("amount");
              }}
            >
              $
            </button>
          </div>
          <div className="tab-content">
            {validationMessage && (
              <div className="validation-message">{validationMessage}</div>
            )}
            {activeTab === "percentage" && (
              <p>Remaining Percentage to Assign: {calculateRemaining()}%</p>
            )}
            {activeTab === "amount" && (
              <p>
                Remaining Amount to Assign: ${calculateRemaining().toFixed(2)}
              </p>
            )}
            {participants.map((participant) => (
              <div key={participant._id} className="amountPerPerson">
                <span className="participant-name">{participant.username}</span>
                {activeTab === "equally" && (
                <span className="participant-amount">
                  {"$" + (totalAmount / participants.length).toFixed(2)}
                  </span>
                  )}
                {activeTab === "percentage" && (
                  <div className="percentageContent">
                    <input
                      type="number"
                      className="participant-percentage-input"
                      value={participantPercentages[participant._id] || ""}
                      onChange={(e) =>
                        handlePercentageChange(e, participant._id)
                      }
                    />
                    <span>% =</span>
                    <span className="calculated-amount">
                      {" " +
                        "$" +
                        calculateAmount(
                          participant._id,
                          totalAmount,
                          participantPercentages
                        ).toFixed(2)}
                    </span>
                  </div>
                )}
                {activeTab === "amount" && (
                  <div className="amountContent">
                  <div className="amountInputContainer">
                    <span className="dollar-sign">$</span>
                    <input
                      type="number"
                      className="participant-amount-input"
                      value={participantAmounts[participant._id] || ""}
                      onChange={(e) => handleAmountChange(e, participant._id)}
                    />
                  </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </button>
        </div>
      </div>
    )
  );
}

export default SplitModal;
