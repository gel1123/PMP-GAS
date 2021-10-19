function doGet() {
  var t = HtmlService.createTemplateFromFile('index.html');
  t.message="PMBOK学習中メモ";

  // テンプレートには文字列として "印刷" するので、連携するなら文字列に変換する必要あり
  t.json = JSON.stringify(app());

  const htmlOutput = t.evaluate();

  // メタ情報はGASウェブアプリならここで設定
  htmlOutput
    .setTitle(t.message)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
  return htmlOutput;
}

function app() {
  const url = "https://docs.google.com/spreadsheets/d/1XOXejEEoF4wJ6BnHvX9Q9QAjKOHnkV2JPOCMaYbcsTo/edit#gid=1751286126";
  const スプレッドシート = SpreadsheetApp.openByUrl(url);
  const プロセスシート = スプレッドシート.getSheetByName("プロセス");
  const 入出力等シート = スプレッドシート.getSheetByName("入出力等");
  const input詳細 = スプレッドシート.getSheetByName("input詳細");
  const tool詳細 = スプレッドシート.getSheetByName("tool詳細");
  const output詳細 = スプレッドシート.getSheetByName("output詳細");
  const 知識エリア詳細 = スプレッドシート.getSheetByName("知識エリア詳細");
  const process詳細 = スプレッドシート.getSheetByName("process詳細");
  const プロセス全データ = プロセスシート.getDataRange().getValues();
  const 入出力等全データ = 入出力等シート.getDataRange().getValues();
  const input詳細全データ = input詳細.getDataRange().getValues();
  const tool詳細全データ = tool詳細.getDataRange().getValues();
  const output詳細全データ = output詳細.getDataRange().getValues();
  const 知識エリア詳細全データ = 知識エリア詳細.getDataRange().getValues();
  const process詳細全データ = process詳細.getDataRange().getValues();


  const プロセス群一覧 = プロセス全データ.filter((row, index) => index > 1 && row[1]).map(row => row[1]);
  const 知識エリア一覧 = プロセス全データ.filter((row, index) => index > 1 && row[3]).map(row => row[3]);

  const プロセステーブル = プロセス全データ.filter((row, index) => index > 1 && row[7]).map(row => {
    return {
      "プロセス群ID": row[5],
      "知識エリアID": row[6],
      "プロセス": row[7]
    };
  });

  const プロセステーブルID変換 = プロセステーブル.map(row => {
    return {
      "プロセス群": プロセス群一覧[row.プロセス群ID-0],
      "知識エリア": 知識エリア一覧[row.知識エリアID-0],
      "プロセス": row.プロセス
    };
  });

  // セル「0」をfilterで除外しないよう工夫している
  const プロセスのインプットテーブル = プロセス全データ.filter((row, index) => index > 1 && row[8]+"").map(row => {
    return {
      "プロセスID": row[9],
      "入出力ID": row[10]
    };
  });
  const プロセスのツールと技法テーブル = プロセス全データ.filter((row, index) => index > 1 && row[11]+"").map(row => {
    return {
      "プロセスID": row[12],
      "ツールと技法ID": row[13]
    };
  });
  const プロセスのアウトプットテーブル = プロセス全データ.filter((row, index) => index > 1 && row[14]+"").map(row => {
    return {
      "プロセスID": row[15],
      "入出力ID": row[16]
    };
  });
  const プロセスのインプット詳細テーブル = input詳細全データ.filter((row, index) => index > 1 && row[0]+"").map(row => {
    return {
      "プロセス": row[1],
      "input": row[2],
      "詳細": row[3]
    };
  });
  const プロセスのツールと技法詳細テーブル = tool詳細全データ.filter((row, index) => index > 1 && row[0]+"").map(row => {
    return {
      "プロセス": row[1],
      "tool": row[2],
      "詳細": row[3]
    };
  });
  const プロセスのアウトプット詳細テーブル = output詳細全データ.filter((row, index) => index > 1 && row[0]+"").map(row => {
    return {
      "プロセス": row[1],
      "output": row[2],
      "詳細": row[3]
    };
  });
  const プロセス詳細テーブル = process詳細全データ.filter((row, index) => index > 1 && row[0]+"").map(row => {
    return {
      "プロセス群": row[1],
      "知識エリア": row[2],
      "プロセス": row[3],
      "定義": row[4],
      "利点": row[5],
      "実行": row[6],
      "その他": row[7]
    };
  });
  const 知識エリア詳細テーブル = 知識エリア詳細全データ.filter((row, index) => index > 1 && row[0]+"").map(row => {
    return {
      "知識エリア": row[1],
      "詳細": row[2],
      "傾向と新たな実務慣行": row[3],
      "テーラリングの考慮事項": row[4],
      "アジャイルや適応型環境への考慮事項": row[5],
      "その他": row[6]
    };
  });

  const 入出力一覧 = 入出力等全データ.filter((row, index) => index > 1 && row[1]).map(row => row[1]);
  const 入出力の説明一覧 =  入出力等全データ.filter((row, index) => index > 1 && row[1]).map(row => row[2]);
  const ツールと技法一覧 = 入出力等全データ.filter((row, index) => index > 1 && row[4]).map(row => row[4]);
  const ツールと技法の説明一覧 =  入出力等全データ.filter((row, index) => index > 1 && row[4]).map(row => row[5]);

  const プロセスのインプットテーブルID変換 = プロセスのインプットテーブル.map(row => {
    return {
      "プロセス": プロセステーブル[row.プロセスID].プロセス,
      "インプット": 入出力一覧[row.入出力ID],
      "入出力の説明一覧": 入出力の説明一覧[row.入出力ID]

    };
  });

  const プロセスのツールと技法テーブルID変換 = プロセスのツールと技法テーブル.map(row => {
    return {
      "プロセス": プロセステーブル[row.プロセスID].プロセス,
      "ツールと技法": ツールと技法一覧[row.ツールと技法ID],
      "ツールと技法の説明一覧": ツールと技法の説明一覧[row.ツールと技法ID]
    };
  });

  const プロセスのアウトプットテーブルID変換 = プロセスのアウトプットテーブル.map(row => {
    return {
      "プロセス": プロセステーブル[row.プロセスID].プロセス,
      "アウトプット": 入出力一覧[row.入出力ID],
      "入出力の説明一覧": 入出力の説明一覧[row.入出力ID]
    };
  });

  const プロセスごとの入出力等 = プロセステーブルID変換.map((row, index) => {
    return {
      "プロセス群": row.プロセス群,
      "知識エリア": row.知識エリア,
      "知識エリア詳細情報": 知識エリア詳細テーブル.find(
        e => e.知識エリア === row.知識エリア && (
          e.詳細 ||
          e.傾向と新たな実務慣行 ||
          e.テーラリングの考慮事項 ||
          e.アジャイルや適応型環境への考慮事項 ||
          e.その他
        )
      ),
      "プロセス": row.プロセス,
      "プロセスID": index,
      "プロセスの定義": プロセス詳細テーブル[index].定義,
      "プロセスの利点": プロセス詳細テーブル[index].利点,
      "プロセスの実行": プロセス詳細テーブル[index].実行,
      "プロセスのその他": プロセス詳細テーブル[index].その他,
      "インプット": プロセスのインプットテーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.インプット),
      "ツールと技法": プロセスのツールと技法テーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.ツールと技法),
      "アウトプット": プロセスのアウトプットテーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.アウトプット),
      "インプットの説明": プロセスのインプットテーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.入出力の説明一覧),
      "ツールと技法の説明": プロセスのツールと技法テーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.ツールと技法の説明一覧),
      "アウトプットの説明": プロセスのアウトプットテーブルID変換.filter(r => r.プロセス == row.プロセス).map(r => r.入出力の説明一覧),
      "input詳細": プロセスのインプット詳細テーブル.filter(r => r.プロセス == row.プロセス).map(r => r.詳細),
      "tool詳細": プロセスのツールと技法詳細テーブル.filter(r => r.プロセス == row.プロセス).map(r => r.詳細),
      "output詳細": プロセスのアウトプット詳細テーブル.filter(r => r.プロセス == row.プロセス).map(r => r.詳細)
    };
  });

  console.log(プロセスごとの入出力等);
  return プロセスごとの入出力等;
}

