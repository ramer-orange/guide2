import React, { useState } from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';
import { AddToPlanDialog } from '../dialogs/AddToPlanDialog'; // ダイアログをインポート
import { Star } from 'lucide-react';

export const CommonInfoWindow = ({
  position,
  onClose,
  title,
  address,
  rating,
  placeId,
  onAddToPlan,
  children,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // ダイアログからデータを受け取り、元のonAddToPlanを呼び出す
  const handleSubmit = (formData) => {
    // TODO: formData（日付やメモ）と元のスポット情報をマージしてonAddToPlanに渡す
    const spotData = {
      name: title,
      address: address,
      // ...その他の情報
      ...formData, // 日付やメモを追加
    };
    onAddToPlan(spotData);
  };

  return (
    <>
      <InfoWindow
        position={position}
        onCloseClick={onClose}
        // InfoWindowのデフォルトスタイルを無効化するため、空のclassNameを渡す
        className="!bg-transparent !p-0 !rounded-none !shadow-none"
      >
        <div className="ui-card bg-background-primary p-4 rounded-ui-lg w-72 shadow-lg border border-border-primary">
          <h3 className="font-bold text-lg text-text-primary truncate">
            {title}
          </h3>
          
          {address && (
            <p className="text-sm text-text-secondary mt-1 truncate">
              {address}
            </p>
          )}
          
          {rating && (
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-bold text-text-primary">{rating}</span>
              <span className="text-sm text-text-secondary">/5</span>
            </div>
          )}
          
          {children}
          
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleOpenDialog} // ダイアログを開く
              className="ui-button-primary w-full"
            >
              プランに追加
            </button>
            
            {placeId && (
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-accent-primary hover:underline"
              >
                Googleマップで見る
              </a>
            )}
          </div>
        </div>
      </InfoWindow>

      <AddToPlanDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        spotData={{ name: title, address }}
      />
    </>
  );
};