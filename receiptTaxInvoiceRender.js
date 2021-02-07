const createTable = require('./lib/createTable')
const getTaxIdAndBranch = require('./lib/getTaxIdAndBranch')
const formatDate = require('./lib/formatDate')
const formatCurrency = require('./lib/formatCurrency')
const thaiBahtToText = require('./lib/thaiBahtToText')
const fontpath = (__dirname + '/THSarabun.ttf');
const fontBoldPath = (__dirname + '/THSarabunNewBold.ttf');
const textX = 40
const lineX = 35

module.exports = function receiptTaxInvoiceRender(documentPDF, docs, transactionArray, page, lastPage) {

    documentPDF.image('../logo/ready_planet_logo.png', 30, 30, {fit: [200, 200]})
    documentPDF
        .fontSize(16)
        .font(fontpath)
        //.text('Readyplanet Co., Ltd. / บริษัท เรดดี้แพลนเน็ต จำกัด', textX, 80, {align: 'left'})
        .text(docs['SCTT.AHTA.STP.Name'], textX, 80, {align: 'left'})

    documentPDF.moveDown(0.4)
        .fontSize(12)
        .text('89 อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ ชั้น 7 ห้อง 704-705 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', {align: 'left'})
        .text('โทร (+662) 016-6789 แฟกซ์ (+662) 016-6906 เลขประจำตัวผู้เสียภาษีอากร 0105543071964 สำนักงานใหญ่', {align: 'left'})
        // .text(docs['SCTT.AHTA.STP.PTA.LineOne'] +' '+ docs['SCTT.AHTA.STP.PTA.LineTwo'] +' '+ docs['SCTT.AHTA.STP.PTA.LineThree'] +' '+ docs['SCTT.AHTA.STP.PTA.LineFour'], {align: 'left'})
        // .text(docs['SCTT.AHTA.STP.PTA.LineFive'] +' '+ 'เลขประจำตัวผู้เสียภาษี' +' '+ getTaxIdAndBranch(docs['SCTT.AHTA.STP.STR.ID']), {align: 'left'})
    documentPDF.moveDown(0.4)
        .text('89 AIA Capital Center, 7th Floor, Unit 704-705 Ratchadapisek Road, Dindaeng, Bangkok 10400 Thailand', {align: 'left'})
        .text('Tel (+662) 016-6789 Fax (+662) 016-6906 TaxID 0105543071964 Heed Office', {align: 'left'})

    documentPDF
        .fontSize(18)
        .font(fontBoldPath)
        .text('ใบเสร็จรับเงิน / ใบกำกับภาษี', 415, 40, {align: 'left'})
        .text('RECEIRT / TAX INVOICE', 420, 55)
        .text('ต้นฉบับ / ORIGINAL', 435, 70)

    documentPDF
        .fontSize(14)
        .font(fontpath)
        .text('เลขที่ / No.:', 450, 98)
        .text(docs['ED.ID'], 500, 98)
    documentPDF.moveDown(0.5)
        .text('วันที่ / Date:', 450, 133)
        .text(formatDate(docs['ED.IssueDateTime']), 500, 133)

    //ข้อมูลฝั่งซ้าย
    const startBoxLeftY = 175
    let branch = docs['SCTT.AHTA.STP.GlobalID']
    if (branch === '00000') {
        branch = "สำนักงานใหญ่"
    }
    
    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('ชื่อลูกค้า :', textX, startBoxLeftY, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.Name'], textX + 45, startBoxLeftY, {width: 240})
        .text('Name', textX, startBoxLeftY + 15)

    documentPDF
        .text('ที่อยู่ :', textX, startBoxLeftY + 35, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.PTA.LineOne'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineTwo'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineThree'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineFive'] +' '+ docs['SCTT.AHTA.BTP.PTA.PostcodeCode'], textX + 45, startBoxLeftY + 35, {width: 240})
        .text('Address', textX, startBoxLeftY + 50)

    documentPDF
        .text('เลขประจำตัวผู้เสียภาษีอากร :', textX, startBoxLeftY + 85, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.STR.ID'].substring(0, 13), textX + 105, startBoxLeftY + 85)
        .text('สาขาที่ :', textX + 190, startBoxLeftY + 85)
        .text(branch, textX + 225, startBoxLeftY + 85)

    //ความยาวของตาราง
    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(lineX, startBoxLeftY - 5, 320, 110)
        .stroke()

    //ข้อมูลฝั้่งขวา
    const startBoxRightX = 370
    const startBoxRightY = 175
    documentPDF
        .fontSize(13)
        .text('รหัสลูกค้า :', startBoxRightX, startBoxRightY, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.ID'], startBoxRightX + 65, startBoxRightY, {align: 'left'})
        .text("Customer's Code ", startBoxRightX, startBoxRightY + 15)

    documentPDF
        .text('Contact Info.:', startBoxRightX, startBoxRightY + 35)
        .text('', startBoxRightX + 65, startBoxRightY + 35, {width: 125})

    documentPDF
        .text('Tel :', startBoxRightX, startBoxRightY + 85, {align: 'left'})
        .text('0968794415', startBoxRightX + 20 , startBoxRightY + 85, {align: 'left'})
        .text('Fax :', startBoxRightX + 85, startBoxRightY + 85, {align: 'left'})
        .text('0968794415', startBoxRightX + 105, startBoxRightY + 85, {align: 'left'})

    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(startBoxRightX - 10, startBoxRightY - 5, 200, 110)
        .stroke();


    const widthFullPage = 525
    let data0 = [
        {
            height: 20,
            items: [
                {
                    text: ["เลขที่ใบสั่งซื้อ Clearing No."],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["Refer Cust id."],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["Domain Name"],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["พนักงานขาย Sales Staff"],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
            ],
        },
    ]

    documentPDF = createTable(documentPDF, data0, lineX, 285);

    let data1 = [
        {
            height: 20,
            items: [
                {
                    text: ["1419086"],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,

                },
                {
                    text: "",
                    width: widthFullPage / 4,
                    align: ["center"],
                    marginTop: 2.5,
                },
                {
                    text: ["Pwai.co.th"],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["Supattra"],
                    width: widthFullPage / 4,
                    align: "center",
                    marginTop: 2.5,
                },
            ],
        },
    ]
    documentPDF = createTable(documentPDF, data1, lineX, 305);

    const widthObj = {
        no: {width: 30, align: 'center'},
        product: {width: 70, align: 'left', marginX: 2},
        desc: {width: 180, align: 'left', marginX: 2.5},
        quantity: {width: 60, align: 'center', currency: true},
        unit: {width: 60, align: 'right', currency: true, marginX: -2},
        discount: {width: 60, align: 'right', currency: true, marginX: -2},
        amount: {width: 65, align: 'right', currency: true, marginX: -2},
    }

    let dataTransactions = [
        {
            height: 30,
            items: [
                {
                    text: ["ลำดับ", "No."],
                    width: widthObj.no.width,
                    align: "center"
                },
                {
                    text: ["รหัสสินค้า", "Product"],
                    width: widthObj.product.width,
                    align: "center"
                },
                {
                    text: ["รายการ", "Description"],
                    width: widthObj.desc.width,
                    align: "center"
                },
                {
                    text: ["จำนวน", "Quantity"],
                    width: widthObj.quantity.width,
                    align: "center"
                },
                {
                    text: ["หน่วยละ", "Unit"],
                    width: widthObj.unit.width,
                    align: "center"
                },
                {
                    text: ["ส่วนลด", "Discount"],
                    width: widthObj.discount.width,
                    align: "center"
                },
                {
                    text: ["จำนวนเงิน", "Amount"],
                    width: widthObj.amount.width,
                    align: "center"
                },
            ],
        },
        {
            height: 300,
            items: [
                {
                    text: "",
                    width: widthObj.no.width,
                },
                {
                    text: "",
                    width: widthObj.product.width,
                },
                {
                    text: "",
                    width: widthObj.desc.width,
                },
                {
                    text: "",
                    width: widthObj.quantity.width,
                },
                {
                    text: "",
                    width: widthObj.unit.width,
                },
                {
                    text: "",
                    width: widthObj.discount.width,
                },
                {
                    text: "",
                    width: widthObj.amount.width,
                },
            ],
        },
    ]

    const startBoxTransactionY = 330
    documentPDF = createTable(documentPDF, dataTransactions, lineX, startBoxTransactionY)

    let summaryTotal = 0
    let positionY = startBoxTransactionY + 30
    transactionArray.forEach((dataObject) => {
        let positionX = lineX
        let lineNumber = Math.max(Math.ceil(dataObject['desc'].length / 39), Math.ceil(dataObject['product'].length / 15))

        for (let key in widthObj) {
            // summary
            if (key === 'amount') {
                summaryTotal += dataObject[key]
            }

            let word = dataObject[key]
            if (!isNaN(word) && widthObj[key].currency) {
                word = formatCurrency(word)
            }
            documentPDF.text(word, positionX + (widthObj[key].marginX || 0), positionY, {
                align: widthObj[key].align,
                width: widthObj[key].width
            })
            positionX += widthObj[key].width
        }
        positionY += (15 * lineNumber)// font size * line number count
    })

    let widthBoxTotal0 = widthObj.no.width + widthObj.product.width + widthObj.desc.width + widthObj.quantity.width
    let widthBoxTotal1 = widthObj.unit.width + widthObj.discount.width
    let widthBoxTotal2 = widthObj.amount.width

    documentPDF.text('รวมเงิน', textX + widthBoxTotal0, positionY)
    documentPDF.text(formatCurrency(summaryTotal), textX + widthBoxTotal0 + widthBoxTotal1 - 7, positionY, {width: widthObj.amount.width, align: 'right'})

    const startTotalBoxY = 635

    let total = ""
    let vat = ""
    let netTotal = ""
    let textThaiBaht = ""

    if (lastPage) {
        total = formatCurrency(docs['SCTT.AHTS.ATT.BasisAmount'])
        vat = formatCurrency(docs['SCTT.AHTS.ATT.CalculatedAmount'])
        netTotal = formatCurrency(docs['SCTT.AHTS.STSHMS.GrandTotalAmount'])
        textThaiBaht = thaiBahtToText(docs['SCTT.AHTS.STSHMS.GrandTotalAmount'] / 100)
    }

    documentPDF
        .fontSize(13)
        .text('Pay By', textX, startTotalBoxY, {align: 'left'})
        .text('TR-KBANK', textX + 40, startTotalBoxY, {align: 'left'})
        .text(textThaiBaht, textX, startTotalBoxY + 40, {align: 'left'})

        .text('ราคารวมทั้งสิ้น / TOTAL', textX + widthBoxTotal0, startTotalBoxY, {align: 'left'})
        .text('ภาษีมูลค่าเพิ่ม / VAT 7%', textX + widthBoxTotal0, startTotalBoxY + 20, {align: 'left'})
        .text('ยอดเงินทั้งสิ้น / Net TOTAL', textX + widthBoxTotal0, startTotalBoxY + 40, {align: 'left'})

        .text(total, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY, {width: widthObj.amount.width - 2, align: 'right'})
        .text(vat, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 20, {width: widthObj.amount.width - 2, align: 'right'})
        .text(netTotal, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 40, {width: widthObj.amount.width - 2, align: 'right'})
    
    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(lineX, startTotalBoxY - 5, widthBoxTotal0, 65)
        .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(lineX + widthBoxTotal0, startTotalBoxY - 5, widthBoxTotal1, 65)
        .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(lineX + widthBoxTotal0 + widthBoxTotal1 , startTotalBoxY - 5, widthBoxTotal2, 65)
        .stroke();

    documentPDF.text('บริษัทฯกำหนดเวลาใรการแก้ไขใบเสร็จ / ใบกำกับภาษีจนถึงวันที่ 5 ของเดือนถัดไปเท่านั้น หากกำหนด บริษัทฯจะไม่รับผิดชอบใดๆทั้งสิ้น', 67, 700, {align: 'left'})


    const startFooterBoxY = 720
    documentPDF.moveTo(lineX + 65, startFooterBoxY + 45)
    documentPDF.lineTo(lineX + 225, startFooterBoxY + 45)
        .text('ผู้รับเงิน / Receiver', lineX + 110, startFooterBoxY + 50, {align: 'left'})
        .text('วันที่', lineX + 110, startFooterBoxY + 65, {align: 'left'})
        .text(formatDate(docs['ED.IssueDateTime']), lineX + 130, startFooterBoxY + 65)


    documentPDF.moveTo(lineX + 315, startFooterBoxY + 45)
    documentPDF.lineTo(lineX + 465, startFooterBoxY + 45)
        .text('ผู้รับมอบอำนาจ', lineX + 365, startFooterBoxY + 50, {align: 'left'})
        .text('Athorizer Signature', lineX + 355, startFooterBoxY + 65, {align: 'left'})

    documentPDF
        .lineJoin("miter")
        .rect(lineX, startFooterBoxY, 525, 85)
        .stroke();

     documentPDF
        .fontSize(12)
        .text(`Page ${page.currentPage} of ${page.totalPage}`, 520, 805, {align: 'left'})

    return documentPDF
}