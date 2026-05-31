import { assetPath } from '../utils/assetPath';

interface BrandLockupProps {
  compact?: boolean;
}

function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`}>
      <img
        src={assetPath('assets/brand/aliyun-qwen-logo.png')}
        alt="阿里云 × 千问大模型"
        loading="eager"
      />
    </div>
  );
}

export default BrandLockup;
