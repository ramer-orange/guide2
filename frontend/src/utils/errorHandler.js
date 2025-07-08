import * as z from "zod/v4"; 

/**
 * エラーハンドリング共通部分
 */

// エラーメッセージの定数定義
export const ERROR_MESSAGES = {
  // 一般的なHTTPエラー
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
  VALIDATION_ERROR: '入力内容に問題があります。',
  UNAUTHORIZED: 'ログインが必要です。',
  FORBIDDEN: 'この操作を行う権限がありません。',
  NOT_FOUND: '要求されたデータが見つかりません。',
  SERVER_ERROR: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。',
  
  // 操作別メッセージ（アプリ固有）
  LOGIN_FAILED: 'ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。',
  LOGOUT_FAILED: 'ログアウトに失敗しました。',
  REGISTER_FAILED: '登録に失敗しました。',
  PLAN_FETCH_FAILED: 'プランの取得に失敗しました。',
  PLAN_CREATE_FAILED: 'プランの作成に失敗しました。',
  PLAN_UPDATE_FAILED: 'プランの更新に失敗しました。',
  PLAN_DELETE_FAILED: 'プランの削除に失敗しました。',
};


/**
 * HTTPステータスコードに基づいてエラーメッセージを取得
 * @param {number} status - HTTPステータスコード
 * @param {string} customMessage - カスタムメッセージ（任意）
 * @returns {string} エラーメッセージ
 */
export const getErrorMessageByStatus = (status, customMessage) => {
  if (customMessage) return customMessage;
  
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 422:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * バリデーションエラー（422）からエラーメッセージを抽出
 * @param {object} errorResponse - エラーレスポンス
 * @returns {string} フォーマットされたエラーメッセージ
 */
export const extractValidationErrors = (errorResponse) => {
  if (errorResponse?.data?.errors) {
    return Object.values(errorResponse.data.errors).flat().join(' ');
  }
  if (errorResponse?.data?.message) {
    return errorResponse.data.message;
  }
  return ERROR_MESSAGES.VALIDATION_ERROR;
};

/**
 * ユーザー向けメッセージ＋エラー種別
 * @param {Error} error - エラーオブジェクト
 * @param {string} operationMessage - 操作固有のメッセージ（任意）
 * @returns {object} { message: string, isUserError: boolean }
 */
export const parseError = (error, operationMessage) => {
  // Zodバリデーションエラーの処理
  if (error instanceof z.ZodError) {
    console.error('Error details: errors', error.issues);
    return {
      message: error.issues.map(e => e.message).join('\n'),
      isUserError: true
    };
  }

  console.error('Error details:', error);

  // ネットワークエラー（レスポンスが存在しない）
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      isUserError: false
    };
  }

  const status = error.response.status;
  // バリデーションエラー（422）の処理
  if (status === 422) {
    return {
      message: extractValidationErrors(error.response),
      isUserError: true
    };
  }

  // その他のHTTPエラー
  const message = operationMessage || getErrorMessageByStatus(status);
  return {
    message,
    isUserError: status >= 400 && status < 500 // 4xxはユーザーエラー
  };
};