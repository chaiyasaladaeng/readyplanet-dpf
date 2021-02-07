const createTable = require('./lib/createTable')
const getTaxIdAndBranch = require('./lib/getTaxIdAndBranch')
const formatDate = require('./lib/formatDate')
const formatCurrency = require('./lib/formatCurrency')
const thaiBahtToText = require('./lib/thaiBahtToText')
const fontpath = (__dirname + '/THSarabun.ttf');
const fontBoldPath = (__dirname + '/THSarabunNewBold.ttf');
const textX = 52
const lineX = 47

module.exports = function  debitNoteRender(documentPDF, docs, transactionArray, page) {

    documentPDF.image('../logo/ready_planet_logo.png', 42, 42, {fit: [200, 200]})
    documentPDF
        .fontSize(13)
        .font(fontpath)
        //.text('Readyplanet Co., Ltd. / บริษัท เรดดี้แพลนเน็ต จำกัด', textX, 90, {align: 'left'})
        .text(docs['SCTT.AHTA.STP.Name'], textX, 90, {align: 'left'})
        documentPDF.moveDown(0.2)
        .text('สำนักงานใหญ่ :', {align: 'left'})
        .text('89 อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ ชั้น 7 ห้อง 704-705 ',textX +60, 108, {align: 'left'})
        .text('ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', textX+60,121,{align: 'left'})
        .text('โทร (+662) 016-6789 แฟกซ์ (+662) 016-6906', textX+60,134,{align: 'left'})
        .text('เลขประจำตัวผู้เสียภาษีอากร 0105543071964', textX+60,147,{align: 'left'})

        .fontSize(18)
        .font(fontBoldPath)
        .text('ใบเพิ่มหนี้/ใบกำกับภาษี', 435, 55, {align: 'left'})
        .text('รับคืนสินค้า', 463, 70)
        .text('ต้นฉบับ Original', 445, 110)

    const headY = 165
    const headX = 425
    documentPDF
        .fontSize(14)
        .font(fontpath)
        .text('เลขที่ใบเพิ่มหนี้ :', headX, headY)
        .text(docs['ED.ID'], headX + 65, headY)
        .text('วันที่ :', headX + 40, headY + 20)
        .text(formatDate(docs['ED.IssueDateTime']), headX + 65, headY + 20)

    //ข้อมูลฝั่งซ้าย
    const startBoxLeftY = 165
    let branch = docs['SCTT.AHTA.STP.GlobalID']
    if (branch === '00000') {
        branch = "สำนักงานใหญ่"
    }

    documentPDF
        .fontSize(13)
        .font(fontpath)
        .text('ชื่อลูกค้า :', textX, startBoxLeftY, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.Name'], textX + 46, startBoxLeftY, {width: 240})
        //ที่อยู่ลูกค้า
        documentPDF.moveDown(0.2)
        .text(docs['SCTT.AHTA.BTP.PTA.LineOne'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineTwo'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineThree'] +' '+ docs['SCTT.AHTA.BTP.PTA.LineFour'] +' '+ 'xxx xxx xxx xxxxxx xxxxxx xxxxx xx xx x XXX XXXXX XXXXX XXX XXXX XXX XX XXXX X XXXXX', {width: 240})
        
        .text('เลขประจำตัวผู้เสียภาษีอากร :', textX, startBoxLeftY + 65, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.STR.ID'].substring(0, 13), textX + 105, startBoxLeftY + 65, {align: 'left'})
        .text('สาขาที่ :', textX + 175, startBoxLeftY + 65, {align: 'left'})
        .text(branch, textX + 210, startBoxLeftY + 65, {align: 'left'})

        .text('อ้างอิงใบกำกับภาษีเลขที่ :', textX, startBoxLeftY + 80, {align: 'left'})
        .text('ARX-99999999', textX + 95, startBoxLeftY + 80, {align: 'left'})
        .text('ลงวันที่ :', textX + 175, startBoxLeftY + 80, {align: 'left'})
        .text('99/99/9999', textX + 210, startBoxLeftY + 80, {align: 'left'})

    //ข้อมูลฝั้่งขวา
    const startBoxRightX = 380
    const startBoxRightY = 239
    documentPDF
        .fontSize(13)
        .text('รหัสลูกค้า :', startBoxRightX, startBoxRightY + 6, {align: 'left'})
        .text(docs['SCTT.AHTA.BTP.ID'], startBoxRightX + 47, startBoxRightY + 6, {align: 'left'})

    documentPDF.moveTo(lineX, 266).lineTo(lineX + 510, 266).stroke()
    documentPDF.moveTo(lineX, 287).lineTo(lineX + 510, 287).stroke()

        .font(fontBoldPath)
        .text('รหัสสินค้า',textX + 14, 270)
        .text('ชื่อสินค้า',textX + 180, 270)
        .text('จำนวน',textX + 327, 270)
        .text('ราคา ',textX + 394, 270)
        .text('จำนวนเงิน',textX + 455, 270)
        .font(fontpath)
   
    const widthObj = {
        product: {width: 70, align: 'center'},
        desc: {width: 250, align: 'left', marginX: 2.5},
        quantity: {width: 50, align: 'center'},
        unit: {width: 70, align: 'right', marginX: -2},
        amount: {width: 70, align: 'right', marginX: -2}
    }

    const startBoxTransactionY = 260

    let summaryTotal = 0
    let positionY = startBoxTransactionY + 30
    transactionArray.forEach((dataObject) => {
        let positionX = lineX
        let lineNumber = Math.max(Math.ceil(dataObject['desc'].length / 55), Math.ceil(dataObject['product'].length / 15))

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

    let widthBoxTotal0 = widthObj.product.width + widthObj.desc.width + widthObj.quantity.width
    let widthBoxTotal1 = widthObj.unit.width //+ widthObj.discount.width
    let widthBoxTotal2 = widthObj.amount.width
    let widthBoxTotal3 = widthObj.product.width + widthObj.desc.width


    const startTotalBoxY = 590
    documentPDF.text('สาเหตุการเพิ่มสินค้าและบริการ :', textX , startTotalBoxY - 20)

    documentPDF
        .fontSize(13)
        .text(thaiBahtToText(docs['SCTT.AHTS.STSHMS.GrandTotalAmount']), textX, startTotalBoxY + 70, {align: 'left'})

        .text('มูลค่าของสินค้า/บริการตามใบกำกับภาษีเดิม', textX + widthBoxTotal3 - 35, startTotalBoxY, {align: 'left'})
        .text('มูลค่าสินค้าหรือบริการที่ถูกต้อง', textX + widthBoxTotal3 - 35, startTotalBoxY + 20, {align: 'left'})
        .text('ผลต่าง', textX + widthBoxTotal0, startTotalBoxY + 40, {align: 'left'})
        .text('VAT 7%', textX + widthBoxTotal0, startTotalBoxY + 55, {align: 'left'})
        .text('สุทธิ', textX + widthBoxTotal0, startTotalBoxY + 70, {align: 'left'})

      // previousInvoiceValue: doc['SCTT.AHTS.STSHMS.OriginalInformationAmount'], //มูลค่าของสินค้า/บริการ ตามใบกำกับภาษีเดิม
      // totalValue: doc['SCTT.AHTS.STSHMS.LineTotalAmount'], //มูลค่าของสินค้าหรือบริการที่ถูกต้อง
      // differenceValue: doc['SCTT.AHTS.STSHMS.DifferenceInformationAmount'], // ผลต่าง / DIFFERENCE VALUE
      // vat: doc['SCTT.AHTS.STSHMS.TaxTotalAmount'], // ภาษีมูลค่าเพิ่ม / VAT 7%
      // grandTotal: doc['SCTT.AHTS.STSHMS.GrandTotalAmount'] // จำนวนเงินสุทธิ / NET VALUE

        .text(formatCurrency(docs['SCTT.AHTS.STSHMS.OriginalInformationAmount']), textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY, {width: widthObj.amount.width - 2, align: 'right'})
        .text(formatCurrency(docs['SCTT.AHTS.STSHMS.LineTotalAmount']), textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 20, {width: widthObj.amount.width - 2, align: 'right'})
        .text(formatCurrency(docs['SCTT.AHTS.STSHMS.DifferenceInformationAmount']), textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 40, {width: widthObj.amount.width - 2, align: 'right'})
        .text(formatCurrency(docs['SCTT.AHTS.STSHMS.TaxTotalAmount']), textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 55, {width: widthObj.amount.width - 2, align: 'right'})
        .text(formatCurrency(docs['SCTT.AHTS.STSHMS.GrandTotalAmount']), textX + widthBoxTotal0 + widthBoxTotal1 - 5, startTotalBoxY + 70, {width: widthObj.amount.width - 2, align: 'right'})

        documentPDF.moveTo(lineX, startTotalBoxY - 5).lineTo(lineX + 510, startTotalBoxY - 5).stroke()
        documentPDF.moveTo(lineX, startTotalBoxY + 90).lineTo(lineX + 510, startTotalBoxY + 90).stroke()

    const startFooterBoxY = 700

    documentPDF.moveTo(lineX + 65, startFooterBoxY)
    documentPDF.lineTo(lineX + 225, startFooterBoxY)
        .text('ผู้จัดทำ', lineX + 110, startFooterBoxY + 25, {align: 'left'})
        .text('วันที่..............................................', lineX + 69, startFooterBoxY + 40, {align: 'left'})
        .text('.....................................................', lineX + 70, startFooterBoxY + 10, {align: 'left'})
    documentPDF.moveTo(lineX + 315, startFooterBoxY )
    documentPDF.lineTo(lineX + 465, startFooterBoxY )
        .text('ผู้รับมอบอำนาจ', lineX + 365, startFooterBoxY + 25, {align: 'left'})
        .text('วันที่..............................................', lineX + 334, startFooterBoxY + 40, {align: 'left'})
        .text('.....................................................', lineX + 335, startFooterBoxY + 10, {align: 'left'})

    .fontSize(11)
    documentPDF.text('หากมีข้อผิดพลาดในใบลดหนี้/ใบกำกับภาษีนี้ กรุณาแจ้งบริษัทภายใน 7 วัน เพื่อดำเนินการแก้ไข มิเช่นนั้นบริษัทฯจะถือว่าเอกสารถูกต้องสมบูรณ์ทุกประการ',lineX , startFooterBoxY + 65, {align: 'left'})
    //documentPDF.text('เอกสารนี้ได้จัดทำและส่งข้อมูลให้แก่กรมสรรพากรด้วยวิธีการทางอิเล็กทรอนิกส์', lineX + 260 ,startFooterBoxY + 85, {align: 'left'})
    documentPDF
        .fontSize(12)
        .text(`Page ${page.currentPage} of ${page.totalPage}`, 520, 805, {align: 'left'})

    return documentPDF
}
