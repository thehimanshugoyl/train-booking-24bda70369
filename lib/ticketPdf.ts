/**
 * Generates and downloads a professional Indian Railways / RailX PDF Ticket using jsPDF.
 */
export async function generateTicketPdf(booking: any) {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const primaryColor = [21, 59, 49]; // Deep emerald teal (#153b31)
    const accentColor = [217, 119, 6]; // Warm gold / amber
    const grayColor = [75, 85, 99]; // Text gray
    const darkColor = [17, 24, 39]; // Near black

    // 1. Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("GADDVYA E-TICKETING SERVICE", 15, 13);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Electronic Reservation Slip (ERS) - Valid with Original ID Proof", 15, 21);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("IRCTC / GADDVYA OFFICIAL", 145, 15);

    // 2. PNR & Booking Summary Box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, 34, 180, 24, 3, 3, "F");

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PNR NUMBER", 22, 42);
    doc.setFontSize(16);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(booking.pnr || "8429103941", 22, 51);

    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("TRAIN NUMBER & NAME", 80, 42);
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    const trainTitle = `${booking.train?.trainNumber || ""} ${booking.train?.trainName || "Express"}`;
    doc.text(trainTitle.slice(0, 32), 80, 51);

    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("CLASS & QUOTA", 150, 42);
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${booking.classType || "SL"} | GENERAL`, 150, 51);

    // 3. Journey Details Section
    let currentY = 66;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(15, currentY, 180, 36, 2, 2, "D");

    // Origin
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFont("helvetica", "normal");
    doc.text("FROM STATION", 22, currentY + 9);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(booking.train?.from || "Delhi", 22, currentY + 17);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Departure: ${booking.train?.departureTime || "06:00"}`, 22, currentY + 25);
    doc.text(`Date: ${booking.train?.date || new Date().toISOString().split("T")[0]}`, 22, currentY + 31);

    // Arrow & Duration in middle
    doc.setFontSize(14);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("──────►", 92, currentY + 16);
    if (booking.train?.duration) {
      doc.setFontSize(8);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(booking.train.duration, 97, currentY + 23);
    }

    // Destination
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFont("helvetica", "normal");
    doc.text("TO STATION", 130, currentY + 9);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Green
    doc.text(booking.train?.to || "Mumbai", 130, currentY + 17);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Arrival: ${booking.train?.arrivalTime || "14:00"}`, 130, currentY + 25);
    doc.text(`Status: CONFIRMED (CNF)`, 130, currentY + 31);

    // 4. Passenger Details Table
    currentY = 110;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("PASSENGER DETAILS", 15, currentY);

    currentY += 4;
    // Table Header
    doc.setFillColor(30, 58, 138);
    doc.rect(15, currentY, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("#", 18, currentY + 5.5);
    doc.text("PASSENGER NAME", 28, currentY + 5.5);
    doc.text("AGE", 95, currentY + 5.5);
    doc.text("GENDER", 115, currentY + 5.5);
    doc.text("COACH / BERTH", 140, currentY + 5.5);
    doc.text("STATUS", 175, currentY + 5.5);

    // Table Rows
    const passengers =
      Array.isArray(booking.passengers) && booking.passengers.length > 0
        ? booking.passengers
        : [
            {
              name: booking.passengerName || "Primary Passenger",
              age: booking.passengerAge || 28,
              gender: "Male",
              seatNumber: "B2-34",
              berthPreference: "Lower",
            },
          ];

    currentY += 8;
    passengers.forEach((p: any, idx: number) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 249 : 255, isEven ? 250 : 255, isEven ? 251 : 255);
      doc.rect(15, currentY, 180, 8, "F");
      doc.setDrawColor(229, 231, 235);
      doc.line(15, currentY + 8, 195, currentY + 8);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(`${idx + 1}`, 18, currentY + 5.5);
      doc.text(`${p.name || "Passenger"}`, 28, currentY + 5.5);
      doc.text(`${p.age || "-"} yrs`, 95, currentY + 5.5);
      doc.text(`${p.gender || "M"}`, 115, currentY + 5.5);
      doc.text(`${p.seatNumber || `B${idx + 1}-${12 + idx * 3}`}`, 140, currentY + 5.5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129); // Green
      doc.text("CNF", 175, currentY + 5.5);

      currentY += 8;
    });

    // 5. Payment & Fare Summary Box
    currentY += 8;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, currentY, 180, 32, 2, 2, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, currentY, 180, 32, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("FARE SUMMARY", 22, currentY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    const baseFare = Math.round(booking.totalPrice * 0.92);
    const taxes = booking.totalPrice - baseFare;
    doc.text(`Ticket Base Fare (${booking.seats} seat(s)):`, 22, currentY + 16);
    doc.text(`₹ ${baseFare}`, 105, currentY + 16);

    doc.text("Convenience Fee & Superfast Surcharge (incl. GST):", 22, currentY + 23);
    doc.text(`₹ ${taxes}`, 105, currentY + 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("TOTAL FARE PAID:", 135, currentY + 16);
    doc.setFontSize(14);
    doc.text(`₹ ${booking.totalPrice}`, 135, currentY + 24);

    // 6. Barcode Simulation (Visual Strip)
    currentY += 40;
    doc.setFillColor(0, 0, 0);
    // Draw alternating vertical bars to simulate a realistic boarding pass barcode
    for (let x = 15; x < 195; x += 1.8) {
      const barWidth = (x % 3 === 0 || x % 5 === 0) ? 1.1 : 0.5;
      doc.rect(x, currentY, barWidth, 11, "F");
    }
    doc.setFontSize(7.5);
    doc.setFont("courier", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`* ${booking.pnr || booking._id} * CNF-GADDVYA-SECURE *`, 68, currentY + 15);

    // 7. Important Instructions
    currentY += 21;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("IMPORTANT INSTRUCTIONS FOR PASSENGERS:", 15, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    const instructions = [
      "1. One of the passengers must carry an original government-recognized Photo ID Proof (Aadhaar, Passport, Voter ID, Driving License).",
      "2. This Electronic Reservation Slip (ERS) along with original ID proof is valid for travel.",
      "3. Please arrive at the origin station at least 30 minutes before scheduled departure.",
      "4. Free cancellation is permitted up to 4 hours before scheduled departure as per railway refund guidelines.",
    ];
    instructions.forEach((ins, i) => {
      doc.text(ins, 15, currentY + 5 + i * 4);
    });

    // 8. Footer Watermark
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Generated on ${new Date().toLocaleString("en-IN")} • GADDVYA Pan-India Railway Portal • Page 1 of 1`,
      50,
      287
    );

    // Save/Download PDF
    const fileName = `Gaddvya-Ticket-${booking.pnr || booking._id}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Failed to generate PDF ticket:", error);
    alert("Could not generate PDF. Please try again.");
  }
}
