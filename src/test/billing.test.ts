import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

async function testBillingTemplate() {
  try {
    // Sample data for testing with multiple customers
    const sampleData = {
      // Shared company information
      logoPath: "http://localhost:3030/logo_company.png",
      companyName: "DYNAMIC DATA",
      companyAddress: "Calle Principal #123",
      companyNeighborhood: "Colonia Centro",
      companyCityState: "Ciudad, Estado",
      companyPhone: "123-456-7890",
      companyMobile: "098-765-4321",
      santanderAccount: "1234567890",
      banamexAccount: "0987654321",

      // Array of customer bills
      customers: [
        {
          customerName: "Juan Pérez",
          customerStreet: "Av. Reforma",
          customerAddress: "Casa #456",
          lotNumber: "A-123",
          meterNumber: "M-789",
          contractNumber: "C-001",
          totalAmount: "1,234.56",
          dueDate: "2024-02-28",
          previousReading: "100",
          currentReading: "150",
          consumption: "50",
          previousDebt: "0.00",
          payment: "0.00",
          consumptionAmount: "500.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "0.00",
        },
        {
          customerName: "María González",
          customerStreet: "Calle Juárez",
          customerAddress: "Apartamento 789",
          lotNumber: "B-456",
          meterNumber: "M-321",
          contractNumber: "C-002",
          totalAmount: "987.65",
          dueDate: "2024-02-28",
          previousReading: "200",
          currentReading: "280",
          consumption: "80",
          previousDebt: "100.00",
          payment: "100.00",
          consumptionAmount: "800.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "12.35",
        },
        /* {
          customerName: "Roberto Sánchez",
          customerStreet: "Calle Pino",
          customerAddress: "Casa #234",
          lotNumber: "C-789",
          meterNumber: "M-456",
          contractNumber: "C-003",
          totalAmount: "1,567.89",
          dueDate: "2024-02-28",
          previousReading: "300",
          currentReading: "390",
          consumption: "90",
          previousDebt: "200.00",
          payment: "200.00",
          consumptionAmount: "900.00",
          baseRate: "200.00",
          surcharges: "50.00",
          discount: "0.00",
        },
        {
          customerName: "Ana Martínez",
          customerStreet: "Av. Libertad",
          customerAddress: "Departamento 567",
          lotNumber: "D-234",
          meterNumber: "M-654",
          contractNumber: "C-004",
          totalAmount: "856.32",
          dueDate: "2024-02-28",
          previousReading: "150",
          currentReading: "220",
          consumption: "70",
          previousDebt: "0.00",
          payment: "0.00",
          consumptionAmount: "700.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "43.68",
        },
        {
          customerName: "Carlos Ramírez",
          customerStreet: "Calle Roble",
          customerAddress: "Casa #890",
          lotNumber: "E-567",
          meterNumber: "M-987",
          contractNumber: "C-005",
          totalAmount: "2,345.67",
          dueDate: "2024-02-28",
          previousReading: "400",
          currentReading: "520",
          consumption: "120",
          previousDebt: "500.00",
          payment: "0.00",
          consumptionAmount: "1,200.00",
          baseRate: "200.00",
          surcharges: "100.00",
          discount: "0.00",
        },
        {
          customerName: "Laura Torres",
          customerStreet: "Av. Principal",
          customerAddress: "Local #123",
          lotNumber: "F-890",
          meterNumber: "M-135",
          contractNumber: "C-006",
          totalAmount: "1,123.45",
          dueDate: "2024-02-28",
          previousReading: "250",
          currentReading: "310",
          consumption: "60",
          previousDebt: "150.00",
          payment: "150.00",
          consumptionAmount: "600.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "25.00",
        },
        {
          customerName: "Miguel Flores",
          customerStreet: "Calle Cedro",
          customerAddress: "Casa #345",
          lotNumber: "G-123",
          meterNumber: "M-246",
          contractNumber: "C-007",
          totalAmount: "934.21",
          dueDate: "2024-02-28",
          previousReading: "180",
          currentReading: "235",
          consumption: "55",
          previousDebt: "0.00",
          payment: "0.00",
          consumptionAmount: "550.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "15.79",
        },
        {
          customerName: "Patricia Vargas",
          customerStreet: "Av. Central",
          customerAddress: "Departamento 789",
          lotNumber: "H-456",
          meterNumber: "M-357",
          contractNumber: "C-008",
          totalAmount: "1,678.90",
          dueDate: "2024-02-28",
          previousReading: "300",
          currentReading: "400",
          consumption: "100",
          previousDebt: "300.00",
          payment: "300.00",
          consumptionAmount: "1,000.00",
          baseRate: "200.00",
          surcharges: "25.00",
          discount: "0.00",
        },
        {
          customerName: "Fernando López",
          customerStreet: "Calle Maple",
          customerAddress: "Casa #678",
          lotNumber: "I-789",
          meterNumber: "M-468",
          contractNumber: "C-009",
          totalAmount: "1,445.78",
          dueDate: "2024-02-28",
          previousReading: "220",
          currentReading: "290",
          consumption: "70",
          previousDebt: "400.00",
          payment: "400.00",
          consumptionAmount: "700.00",
          baseRate: "200.00",
          surcharges: "0.00",
          discount: "30.00",
        },
        {
          customerName: "Isabel Morales",
          customerStreet: "Av. Palmas",
          customerAddress: "Local #901",
          lotNumber: "J-012",
          meterNumber: "M-579",
          contractNumber: "C-010",
          totalAmount: "2,123.45",
          dueDate: "2024-02-28",
          previousReading: "450",
          currentReading: "560",
          consumption: "110",
          previousDebt: "250.00",
          payment: "250.00",
          consumptionAmount: "1,100.00",
          baseRate: "200.00",
          surcharges: "75.00",
          discount: "0.00",
        }, */
      ],
    };

    // Read the template file
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "billing.template.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf-8");

    // Compile the template
    const template = handlebars.compile(templateHtml);

    // Generate HTML with all customer bills
    const html = template(sampleData);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(html);
    await page.pdf({
      path: "billing-test.pdf",
      format: "A4",
      landscape: true,
      printBackground: true,
    });

    await browser.close();
    console.log("PDF generated successfully: billing-test.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

// Run the test
testBillingTemplate();
