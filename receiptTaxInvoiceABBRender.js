const createTable = require('./lib/createTable')
const getTaxIdAndBranch = require('./lib/getTaxIdAndBranch')
const formatDate = require('./lib/formatDate')
const formatCurrency = require('./lib/formatCurrency')
const thaiBahtToText = require('./lib/thaiBahtToText')
const fontpath = (__dirname + '/THSarabun.ttf');
const fontBoldPath = (__dirname + '/THSarabunNewBold.ttf');
const textX = 40
const lineX = 35

module.exports = function receiptTaxInvoiceMiniRender(documentPDF, docs, transactionArray, page, lastPage) {
  

    documentPDF.image('../logo/ready_planet_logo.png', 30, 30, {fit: [200, 200]})
    documentPDF
        .fontSize(12)
        .font(fontpath)
        //.text('Readyplanet Co., Ltd. / บริษัท เรดดี้แพลนเน็ต จำกัด', textX, 80, {align: 'left'})
        .text(docs['SCTT.AHTA.STP.Name'], textX, 80, {align: 'left'})
    documentPDF.moveDown(0.5)
        .text('89 อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ ชั้น 7 ห้อง 704-705 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', {align: 'left'})
        .text('โทร (+662) 016-6789 แฟกซ์ (+662) 016-6906 เลขประจำตัวผู้เสียภาษีอากร 0105543071964 สำนักงานใหญ่', {align: 'left'})
    documentPDF.moveDown(0.5)
        .text('89 AIA Capital Center, 7th Floor, Unit 704-705 Ratchadapisek Road, Dindaeng, Bangkok 10400 Thailand', {align: 'left'})
        .text('Tel (+662) 016-6789 Fax (+662) 016-6906 TaxID 0105543071964 Heed Office', {align: 'left'})

    documentPDF
        .fontSize(18)
        .font(fontBoldPath)
        .text('ใบเสร็จรับเงิน / ใบกำกับภาษีอย่างย่อ', 382, 170)
        .text('Tax Receipt / Tax Invoice', 405, 185)

    //ข้อมูลฝั่งซ้าย
    const startBoxLeftY = 175
    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('เลขที่ / No. :', textX + 10, startBoxLeftY + 15)
        .text(docs['ED.ID'], textX + 70, startBoxLeftY + 15)
    documentPDF.moveDown(0.5)
        .text('วันที่ / Date :', textX +10, startBoxLeftY + 45)
        .text(formatDate(docs['ED.IssueDateTime']), textX +70, startBoxLeftY + 45)
    //create rectangles
    //กล่องเลขที่
        documentPDF
        .lineJoin("miter")
        .rect(lineX, startBoxLeftY - 5 , 280, 90)
        .stroke() 


    const widthObj = {
        no: {width: 30, align: 'center'},
        product: {width: 70, align: 'left', marginX: 2},
        desc: {width: 180, align: 'left', marginX: 2.5},
        quantity: {width: 60, align: 'center', currency: true},
        unit: {width: 65, align: 'right', currency: true, marginX: -2},
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

    const startBoxTransactionY = 275
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

    const startTotalBoxY = 580
       
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
        .text(textThaiBaht, textX, startTotalBoxY + 50, {align: 'left'})

        .text('ราคารวมทั้งสิ้น / TOTAL', textX + widthBoxTotal0, startTotalBoxY, {align: 'left'})
        .text('ภาษีมูลค่าเพิ่ม / VAT 7%', textX + widthBoxTotal0, startTotalBoxY + 25, {align: 'left'})
        .text('ยอดเงินทั้งสิ้น / NET TOTAL', textX + widthBoxTotal0, startTotalBoxY + 50, {align: 'left'})
        
        .fontSize(12)
        .text('(ราคารวมภาษีมูลค่าเพิ่ม)', textX + widthBoxTotal0, startTotalBoxY + 65, {align: 'left'})
        
        .fontSize(13)
        .text(total, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY, {width: widthObj.amount.width - 2, align: 'right'})
        .text(vat, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 25, {width: widthObj.amount.width - 2, align: 'right'})
        .text(netTotal, textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 50, {width: widthObj.amount.width - 2, align: 'right'})
    
    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(lineX, startTotalBoxY -5, widthBoxTotal0, 85)
        .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(lineX + widthBoxTotal0, startTotalBoxY -5  , widthBoxTotal1, 85)
        .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(lineX + widthBoxTotal0 + widthBoxTotal1 , startTotalBoxY -5, widthBoxTotal2, 85)
        .stroke();

    const startFooterBoxY = 720
    documentPDF
    .text('ลงชื่อผู้รับเงิน................................................', lineX + 50, startFooterBoxY - 20)
    .text('วันที่..............................................................', lineX + 50, startFooterBoxY)
    .text(formatDate(docs['ED.IssueDateTime']), lineX + 100, startFooterBoxY - 5)
    //documentPDF.text('เอกสารนี้ได้จัดทำและส่งข้อมูลให้แก่กรมสรรพากรด้วยวิธีการทางอิเล็กทรอนิกส์', lineX + 200, startFooterBoxY + 50, {align: 'left'})

     documentPDF
        .fontSize(12)
        .text(`Page ${page.currentPage} of ${page.totalPage}`, 520, 805, {align: 'left'})

    return documentPDF
}
