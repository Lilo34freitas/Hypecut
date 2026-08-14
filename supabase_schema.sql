-- ==============================================================================
-- SCHEMA DE SEGURANÇA E BANCO DE DADOS HYPECUT (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Habilitação de Extensões Necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuário com Roles (Controle de Acesso Baseado em Papéis - RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    surname TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'ADMIN', 'BARBER')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Profissionais
CREATE TABLE IF NOT EXISTS public.professionals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    specialties TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'masculino' | 'feminino' | 'combos' | 'tattoo'
    duration_min INTEGER NOT NULL DEFAULT 30,
    price NUMERIC(10,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_notes TEXT,
    service_id TEXT REFERENCES public.services(id) ON DELETE RESTRICT,
    professional_id TEXT REFERENCES public.professionals(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED', 'PENDING', 'COMPLETED')),
    cancel_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Habilitação do Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 7. Função Auxiliar de Verificação de Administrador (Security Definer para evitar recursão)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
$$;

-- 8. Trigger para sincronizar novos usuários de auth.users com public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name, surname, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'surname', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        surname = EXCLUDED.surname,
        phone = EXCLUDED.phone;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. Políticas de Segurança (Row Level Security - RLS)
-- ==============================================================================

-- (A) PROFILES
DROP POLICY IF EXISTS "Usuarios visualizam seu proprio perfil ou admin ve todos" ON public.profiles;
CREATE POLICY "Usuarios visualizam seu proprio perfil ou admin ve todos"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios atualizam seu proprio perfil" ON public.profiles;
CREATE POLICY "Usuarios atualizam seu proprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- (B) SERVIÇOS E PROFISSIONAIS
DROP POLICY IF EXISTS "Servicos visiveis publicamente" ON public.services;
CREATE POLICY "Servicos visiveis publicamente"
ON public.services FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Profissionais visiveis publicamente" ON public.professionals;
CREATE POLICY "Profissionais visiveis publicamente"
ON public.professionals FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins gerenciam servicos" ON public.services;
CREATE POLICY "Admins gerenciam servicos"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins gerenciam profissionais" ON public.professionals;
CREATE POLICY "Admins gerenciam profissionais"
ON public.professionals FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- (C) AGENDAMENTOS (APPOINTMENTS)
-- 1. SELECT: Dono do agendamento ou Administrador
DROP POLICY IF EXISTS "Usuarios visualizam apenas seus proprios agendamentos ou admin" ON public.appointments;
CREATE POLICY "Usuarios visualizam apenas seus proprios agendamentos ou admin"
ON public.appointments FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- 2. INSERT: Usuários autenticados criam agendamentos para si ou Admin cria para qualquer um
DROP POLICY IF EXISTS "Usuarios autenticados criam seus proprios agendamentos" ON public.appointments;
CREATE POLICY "Usuarios autenticados criam seus proprios agendamentos"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3. UPDATE: Dono pode alterar com mais de 5 horas de antecedência ou Admin a qualquer momento
DROP POLICY IF EXISTS "Usuarios reagendam ou cancelam com mais de 5 horas ou admin" ON public.appointments;
CREATE POLICY "Usuarios reagendam ou cancelam com mais de 5 horas ou admin"
ON public.appointments FOR UPDATE
TO authenticated
USING (
    (auth.uid() = user_id AND start_time > (now() + interval '5 hours'))
    OR public.is_admin()
)
WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
);

-- ==============================================================================
-- 10. Índices de Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_pro_date ON public.appointments(professional_id, start_time);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
