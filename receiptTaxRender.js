const createTable = require('./lib/createTable')
const getTaxIdAndBranch = require('./lib/getTaxIdAndBranch')
const formatDate = require('./lib/formatDate')
const formatCurrency = require('./lib/formatCurrency')
const thaiBahtToText = require('./lib/thaiBahtToText')
const fontpath = (__dirname + '/THSarabun.ttf');
const fontBoldPath = (__dirname + '/THSarabunNewBold.ttf');
const textX = 40
const lineX = 35

module.exports = function receiptTaxRender(documentPDF, docs, transactionArray, page, lastPage) {
    documentPDF.image('../logo/ready_planet_logo.png', 30, 30, { fit: [200, 200] })

    documentPDF
        .fontSize(16)
        .font(fontpath)
        .font(fontBoldPath)
        .text(docs['SCTT.AHTA.STP.Name'], textX, 80, { align: 'left' })
        // .text('บริษัท เรดดี้แพลนเน็ต จำกัด', textX, 80, { align: 'left' })
        
    documentPDF
        .fontSize(13)
        .font(fontpath)
        .font(fontBoldPath)
        .text('สำนักงานใหญ่ :', textX, 100, { align: 'left' })

    documentPDF
        .fontSize(13)
        .font(fontpath)

    documentPDF.moveDown(0.5)
    documentPDF.text('89 อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ ชั้น 7 ห้อง 704-705', 105, 100, { align: 'left' })
    documentPDF.text('ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', { align: 'left' })
    documentPDF.text('โทร : 02-016-6789  แฟกซ์ : 02-016-6901', { align: 'left' })
    documentPDF.text('เลขประจำตัวผู้เสียภาษีอากร : 0105543071964', { align: 'left' })

    documentPDF
        .fontSize(18)
        .font(fontBoldPath)
    //documentPDF.moveDown(0.25)
    documentPDF.text('ใบเสร็จรับเงิน / ใบกำกับภาษี', 420, 40, { align: 'left' })
    documentPDF.text('Receipt / Tax Invoice', 430, 55)
    documentPDF.text('ต้นฉบับ / ORIGINAL', 440, 70)

    documentPDF
        .fontSize(13)
        .font(fontpath)
    documentPDF.moveDown(1)
    documentPDF.text('เลขที่ / No. :' + " " + docs ['ED.ID'], 450)
    //documentPDF.text('เลขที่ / No. : 420080067 ', 450)
    

    documentPDF.moveDown(0.75)
    documentPDF.text('วันที่ / Date :' + " " + formatDate(docs ['ED.IssueDateTime'], 450))
    //documentPDF.text('วันที่ / Date : 17/08/2020', 450)


    ///ข้อมูลลุกค้า///
    const starBoxLeftY = 170
    let branch = docs['SCTT.AHTA.STP.GlobalID']
    if (branch === '00000') {
        branch = "สำนักงานใหญ่"
    }
    
    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('ชื่อลูกค้า : ', textX, starBoxLeftY + 5, { align: 'left' })
        .text(docs['SCTT.AHTA.BTP.NAME'], textX + 40, starBoxLeftY + 5, { width: 280 })
    documentPDF.moveDown(0.5)
    documentPDF.text('Name', textX, starBoxLeftY + 20)

    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('ที่อยู่ :', textX, starBoxLeftY + 40, { align: 'left' })
        .text(docs['SCTT.AHTA.BTP.PTA.LineOne'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineTwo'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineThree'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineFive'], textX + 40, starBoxLeftY + 40, { width: 280 })
    documentPDF.moveDown(0.25)
        .text('Address', textX, starBoxLeftY + 55)
        .text('เลขประจำตัวผู้เสียภาษี :', textX, starBoxLeftY + 90)
        .text(docs['SCTT.AHTA.BTP.STR.ID'].substring(0, 13), textX + 90, starBoxLeftY + 90)
        .text('สาขาที่ :', textX + 185, starBoxLeftY + 90)
        .text(branch, textX + 220, starBoxLeftY + 90)


    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(lineX, starBoxLeftY, 335, 110)
        .stroke();


    const starBoxRightX = 380
    const starBoxRightY = 170
    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('รหัสลูกค้า :', starBoxRightX, starBoxRightY + 5, { align: 'left' })
        .text(docs['SCTT.AHTA.BTP.ID'], starBoxRightX + 60, starBoxRightY + 5, { align: 'left' })
    documentPDF.moveDown(0.5)
    documentPDF.text('Customer Code', starBoxRightX, starBoxRightY + 20)
        .font(fontBoldPath)
        .text('Contact Information :', starBoxRightX, starBoxRightY + 38, { align: 'left' })
        .font(fontpath)
        .text('Tel : 023191564   Fax : 1111111111', starBoxRightX, starBoxRightY + 90, { align: 'left' })

    //create rectangles
    documentPDF
        .lineJoin("miter")
        .rect(starBoxRightX - 5, starBoxRightY, 185, 110)
        .stroke();


    const widthFullPage = 525
    let data0 = [
        {
            height: 20,
            items: [
                {
                    text: ["เลขที่ใบสั่งซื้อ / Clearing No."],
                    width: widthFullPage / 3,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["เลขที่ใบแจ้งหนี้ / Invoice No."],
                    width: widthFullPage / 3,
                    align: "center",
                    marginTop: 2.5,
                },
                {
                    text: ["พนักงานขาย / Saleman"],
                    width: widthFullPage / 3,
                    align: "center",
                    marginTop: 2.5,
                },
                // {
                //     text: "x3",
                //     width: widthFullPage/4,
                //     align: "center"
                // },
            ],
        }
    ]
    documentPDF = createTable(documentPDF, data0, lineX, 285);

    let data1 = [
        {
            height: 20,
            items: [
                {
                    text: ["x0"],
                    width: widthFullPage / 3,
                    align: "center"
                },
                {
                    text: ["x1"],
                    width: widthFullPage / 3,
                    align: "center"
                },
                {
                    text: ["x2"],
                    width: widthFullPage / 3,
                    align: "center"
                },
                // {
                //     text: "x3",
                //     width: widthFullPage/4,
                //     align: "center"
                // },
            ],
        }
    ]
    documentPDF = createTable(documentPDF, data1, lineX, 305);


    ////ช่องรายการ////
    const widthObj = {
        no: { width: 30, align: 'center' },
        product: { width: 70, align: 'left', marginX: 5 },
        desc: { width: 180, align: 'left', marginX: 5 },
        quantity: { width: 60, align: 'right', currency: true, marginX: -2.5 },
        unit: { width: 60, align: 'right', currency: true, marginX: -2.5 },
        discount: { width: 60, align: 'right', currency: true, marginX: -2.5 },
        amount: { width: 65, align: 'right', currency: true, marginX: -2.5 },
    }

    let dataTransactions = [
        {
            height: 30,
            items: [
                {
                    text: ["ลำดับ", "No"],
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
            height: 205, ///ขนาดความยาวของรายการ///
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

    let positionY = startBoxTransactionY + 30
    transactionArray.forEach((dataObject) => {
        let positionX = lineX
        let lineNumber = Math.max(Math.ceil(dataObject['desc'].length / 39), Math.ceil(dataObject['product'].length / 15))
    
        for (let key in widthObj) {

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

    const startTotalBoxY = 535

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
        .font(fontpath)
        .text('จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)', textX, startTotalBoxY + 50, { align: 'left' })
        .text((textThaiBaht), textX + 10, startTotalBoxY + 65,)

    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('ราคารวมทั้งสิ้น', textX + widthBoxTotal0, startTotalBoxY + 5, { align: 'left' })
        .text('TOTAL', textX + widthBoxTotal0, startTotalBoxY + 20,)
        .text('ภาษีมูลค่าเพิ่ม 7%', textX + widthBoxTotal0, startTotalBoxY + 35,)
        .text('VAT', textX + widthBoxTotal0, startTotalBoxY + 50,)
        .text('จำนวนเงินรวมทั้งสิ้น', textX + widthBoxTotal0, startTotalBoxY + 65,)
        .text('NET TOTAL', textX + widthBoxTotal0, startTotalBoxY + 80,)

        .text(total, textX + widthBoxTotal0 + widthBoxTotal1, startTotalBoxY + 5, { width: widthObj.amount.width - 7, align: 'right' })
        .text(vat, textX + widthBoxTotal0 + widthBoxTotal1, startTotalBoxY + 35, { width: widthObj.amount.width - 7, align: 'right' })
        .text(netTotal, textX + widthBoxTotal0 + widthBoxTotal1, startTotalBoxY + 65, { width: widthObj.amount.width - 7, align: 'right' })
    
    //create rectangles
    documentPDF
         .lineJoin("miter")
         .rect(lineX, startTotalBoxY, 340, 100)
         .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(textX + widthBoxTotal0 - 5, startTotalBoxY, 120, 100)
        .stroke();
    documentPDF
        .lineJoin("miter")
        .rect(495, startTotalBoxY, 65, 100)
        .stroke();

    // draw rectangle
    let cash = ''
    let bankTranfer = ''
    let cheque = ''
    docs['@Payments'].forEach((payment)=>{
        if (payment.paymentType === 1){
            bankTranfer = payment
        }else if (payment.paymentType === 2){
            cash = payment
        }else if (payment.paymentType === 3){
            cheque = payment
        }
    })


    let widthRectangle = 10
    let y = 650
    console.log(docs['@Payments'])
    // cash
    documentPDF
        .lineWidth(0.5)
        .rect(textX + 55, y + 4, widthRectangle, widthRectangle).stroke()
    documentPDF.text("ชำระเงินโดย", textX, y)
    documentPDF.text("เงินสด", 115, y)
    
    if (cash){
        documentPDF.text('x', 100, y)
        documentPDF.text(formatCurrency(cash.docTotal), 150, y, {width: 80})
    }
        
    documentPDF.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(145, y + 12)
        .lineTo(225, y + 12)
        .text("บาท", 230, y)
        .dash(1, { space: 2 })
        .stroke()

    y += 15
    documentPDF
        .lineWidth(0.5)
        .strokeColor("#000")
        .rect(95, y + 4, widthRectangle, widthRectangle).undash()
        .stroke()
    documentPDF.text("เงินโอน", 115, y)
    
    if (bankTranfer){
        documentPDF.text('x', 100, y)
        documentPDF.text(formatCurrency(bankTranfer.docTotal), 150, y, {width: 80})
    }
    
    documentPDF.strokeColor("#aaaaaa")
        .lineWidth(0.5)
        .moveTo(145, y + 12)
        .lineTo(225, y + 12)
        .text("บาท", 230, y)
        .dash(1, { space: 2 })
        .stroke()

    y += 15
    documentPDF
        .lineWidth(0.5)
        .strokeColor("#000")
        .rect(95, y + 4, widthRectangle, widthRectangle).undash()
        .stroke()
    documentPDF.text("เช็คเลขที่", 115, y)
    
    if (cheque){
        documentPDF.text('x', 100, y)
        documentPDF.text(cheque.chequeNum, 150, y, {width: 80})
        documentPDF.text(formatDate(cheque.dueDate), 270, y, {width: 80})
        documentPDF.text(cheque.bankName, 370, y, {width: 80})
        documentPDF.text(formatCurrency(cheque.docTotal), 370, y, {width: 80})
    }
    
    documentPDF.strokeColor("#aaaaaa")
        .lineWidth(0.5)
        .moveTo(150, y + 12)
        .lineTo(225, y + 12)
        .dash(1, { space: 2 })
        .stroke()

    documentPDF.text("ลงวันที่", 230, y)
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(260, y + 12)
        .lineTo(325, y + 12)
        .dash(1, { space: 2 })
        .stroke()

    documentPDF.text("ธนาคาร", 330, y)
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(365, y + 12)
        .lineTo(430, y + 12)
        .dash(1, { space: 2 })
        .stroke()

    documentPDF.text("จำนวนเงิน", 435, y)
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(480, y + 12)
        .lineTo(550, y + 12)
        .text("บาท", 555, y)
        .dash(1, { space: 2 })
        .stroke()

    const startFooterBoxY = 750

    documentPDF
        .fontSize(13)
        .font(fontpath)
        .moveTo(145, startFooterBoxY)
        .lineTo(240, startFooterBoxY)
        .stroke()
        .text("ผู้รับเงิน / Receiver", lineX + 125, startFooterBoxY + 5 , { align: 'left' })
        .text("วันที่", lineX + 125, startFooterBoxY + 20,)
        .text(formatDate(docs['ED.IssueDateTime']), lineX + 145, startFooterBoxY + 20,)

        .moveTo(360, startFooterBoxY)
        .lineTo(455, startFooterBoxY)
        .stroke()
        .text("ผู้รับมอบอำนาจ", lineX + 350, startFooterBoxY + 5,)
        .text("Authorizer Signature", lineX + 335, startFooterBoxY + 20,)

    documentPDF
        .fontSize(12)
        .font(fontpath)
    documentPDF.moveDown(1)
    documentPDF.text('หากมีข้อผิดพลาดใดในใบเสร็จรับเงิน/ใบกำกับภาษีนี้ กรุณาแจ้งบริษัทฯ ภายใน 7 วัน เพื่อดำเนินการแก้ไข มิฉะนั้นบริษัทฯ จะถือว่าเอกสารถูกต้องสมบูรณ์ทุกประการ', textX, startFooterBoxY + 40, { align: 'left' })

    documentPDF
        .fontSize(12)
        .text(`Page ${page.currentPage} of ${page.totalPage}`, 520, 805, { align: 'left' })


    return documentPDF

}