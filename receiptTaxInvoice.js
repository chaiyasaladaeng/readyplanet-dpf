const receiptTaxInvoiceRender = require('./receiptTaxInvoiceRender')

module.exports = function receiptTaxInvoice(PDFDocument, docs, imageLogo) {
    let documentPDF = new PDFDocument({size: "A4", margin: 20})

    /// start mock data for test ///
    // let desc0 = 'Google Ads'
    // let desc1 = 'Google Ads Google Ads Google Ads Google Ads Google Ads Google Ads Google Ads'
    // let productTest = '57-2121-588888'
    //
    // let lineCount = 0
    // let totalTransactionArray = []
    // let tmpDataArray = []
    // for (let i = 1; i <= 15; i++) {
    //     let objMock = {
    //         no: i,
    //         product: productTest,
    //         desc: desc1,
    //         quantity: '1888808.00',
    //         unit: '88,000,000.00',
    //         discount: '88,888,888.00',
    //         amount: '88,000,000.00',
    //     }
    //     lineCount += Math.max(Math.ceil(desc1.length / 39), Math.ceil(productTest.length / 15))
    //     tmpDataArray.push(objMock)
    //     if (lineCount > 14) {
    //         totalTransactionArray.push(tmpDataArray)
    //         lineCount = 0
    //         tmpDataArray = []
    //     }
    //
    //     if (i === 15 && tmpDataArray.length > 0) { // last row (append data last page)
    //         totalTransactionArray.push(tmpDataArray)
    //     }
    // }
    /// end mock data for test ///

    const maxLineInPage = 14
    let lineCount = 0
    let totalTransactionArray = []
    let tmpDataArray = []

    for (let i = 0; i < docs['SCTT.ISCTLI'].length; i++) {
        let product = docs['SCTT.ISCTLI'][i]['STP.ID']
        let desc = docs['SCTT.ISCTLI'][i]['STP.Name']

        let objMock = {
            no: docs['SCTT.ISCTLI'][i]['ADLD.LineID'],
            product: product,
            desc: desc,
            quantity: docs['SCTT.ISCTLI'][i]['SLTD.BilledQuantity'],
            unit: docs['SCTT.ISCTLI'][i]['SLTA.GPPTP.ChargeAmount'],
            discount: docs['SCTT.ISCTLI'][i]['SLTS.STAC.ActualAmount'],
            amount: docs['SCTT.ISCTLI'][i]['SLTS.STSLMS.NetLineTotalAmount'],
        }
        lineCount += Math.max(Math.ceil(desc.length / 39), Math.ceil(product.length / 15))
        tmpDataArray.push(objMock)
        if (lineCount > maxLineInPage) {
            totalTransactionArray.push(tmpDataArray)
            lineCount = 0
            tmpDataArray = []
        }

        if ((i === docs['SCTT.ISCTLI'].length - 1) && tmpDataArray.length > 0) { // last row (append data last page)
            totalTransactionArray.push(tmpDataArray)
        }
    }

    // render with transactions
    totalTransactionArray.forEach((transactionArray, index) => {
        //check last page
        let lastPage = false
        if (index === totalTransactionArray.length - 1) {
            lastPage = true
        }

        // print page
        documentPDF = receiptTaxInvoiceRender(documentPDF, docs, transactionArray, {currentPage: index + 1, totalPage: totalTransactionArray.length,}, lastPage)
        // check not equal
        if (index !== totalTransactionArray.length - 1) {
            documentPDF.addPage()
        }
    })
    return documentPDF
}